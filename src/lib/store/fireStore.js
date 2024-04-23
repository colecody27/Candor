import { writable } from 'svelte/store';
import { db } from '$lib/firebase/firebase.client';
import {
	Timestamp,
	collection,
	addDoc,
	doc,
	setDoc,
	getDoc,
	getDocs,
	updateDoc,
	arrayUnion,
	arrayRemove,
	query,
	where,
	deleteDoc,
	deleteField,
	increment
} from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';
import { authStore } from './authStore';
import { update } from 'firebase/database';
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';

/** @type {import("@firebase/auth").User} */
let User;
let univ;
let friends;
let defaultResume;
let userInfo; 
const storage = getStorage();

authStore.subscribe((curr) => {
	User = curr?.user;
	univ = curr?.university;
	friends = curr?.friends;
	defaultResume = curr?.resume; 
	userInfo = curr;
});

export const dataHandlers = {
	// ADD APPLICATION
	addApp: async (role, company, term) => {
		// CREATE APP
		const application = {
			Company: company,
			Role: role,
			Term: term,
			Status: true,
			Interviews: [],
			Location: 'TBD',
			Platform: 'Unknown',
			Notes: '',
			Topics: [],
			Id: '',
			resume: userInfo.resume,
			Date: Timestamp.fromDate(new Date())
		};

		console.log('add app ');
		// UPDATE DB
		const route = 'users/' + User.email + '/applications';
		const docRef = await addDoc(collection(db, route), application);
		application.Id = docRef.id;

		// Increment resume count
		if (userInfo.resume != '') {
			await dataHandlers.updateResumeCount(userInfo.resume, "increment");
		}

		// UPDATE LOCAL STORAGE
		if (docRef) {
			authStore.update((curr) => {
				return { ...curr, apps: [application, ...curr.apps] };
			});
		}
	},

	// UPDATE STATUS
	updateStatus: async (id, status) => {
		// UPDATE DB
		const route = 'users/' + User.email + '/applications/' + id;
		const docRef = doc(db, route);
		await updateDoc(docRef, { Status: status });

		// UPDATE LOCAL STORAGE
		if (docRef) {
			authStore.update((curr) => {
				const indx = curr.apps.findIndex((app) => app.Id === id);
				curr.apps.at(indx).Status = status;
				return curr;
			});
		}
	},

	// UPDATE APPLICATION
	updateApp: async (role, company, period) => {
		// Create application to pass information
		const application = {
			Role: role,
			Company: company,
			Period: period
		};

		// Add application to collection
		const route = 'users/' + User.email + '/applications';
		const docRef = await addDoc(collection(db, route), application);
	},

	// REMOVE APPLICATION
	removeApp: async (id) => {
		// UPDATE DB
		const route = 'users/' + User.email + '/applications/' + id;
		await deleteDoc(doc(db, route));

		// Increment resume count
		if (defaultResume.name != '') {
			console.log(userInfo)
			let resumeName = userInfo.apps.find((app) => app.Id === id).resume; 
			console.log("resume name:" + resumeName)
			await dataHandlers.updateResumeCount(resumeName, "decrement");
		}

		// UPDATE LOCAL STORAGE
		authStore.update((curr) => {
			const indx = curr.apps.findIndex((app) => app.Id === id);
			curr.apps.splice(indx, 1);
			return curr;
		});
	},

	// GET ALL APPLICATIONS
	getApps: async () => {
		const route = 'users/' + User.email + '/applications';
		const querySnpsht = await getDocs(collection(db, route));
		const applications = [];
		querySnpsht.forEach((doc) => {
			applications.push(doc.data);
		});
	},

	// ADD TERM
	addTerm: async (term) => {
		// UPDATE DB
		const route = 'users/' + User.email;
		const docRef = doc(db, route);

		await updateDoc(docRef, {
			terms: arrayUnion(term)
		});

		// UPDATE LOCAL STORAGE
		if (docRef) {
			authStore.update((curr) => {
				curr.terms.push(term)
				return curr;
			});
		}
	},

	// EDIT TERM
	editTerm: async (oldTerm, newTerm) => {
		// DB - Update every application
		const appRoute = 'users/' + User.email + '/applications';
		const q = query(collection(db, appRoute), where('Term', '==', oldTerm));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach(async (app) => {
			const route = 'users/' + User.email + '/applications/' + app.id;
			const docRef = doc(db, route);
			await updateDoc(docRef, {
				Term: newTerm
			});
		});

		// DB - Update list of terms
		const termRoute = 'users/' + User.email;
		const termRef = doc(db, termRoute);
		await updateDoc(termRef, {
			terms: arrayRemove(oldTerm)
		});
		await updateDoc(termRef, {
			terms: arrayUnion(newTerm)
		});

		// UPDATE LOCAL STORAGE
		if (termRef) {
			authStore.update((curr) => {
				for (var i = 0; i < curr.apps.length; i++) {
					if (curr.apps.at(i).Term === oldTerm) curr.apps.at(i).Term = newTerm;
				}
				const indx = curr.terms.findIndex((t) => t === oldTerm);
				if (indx > -1) curr.terms.splice(indx, 1, newTerm);
				return curr;
			});
		}
	},

	// EDIT TERM
	removeTerm: async (term) => {
		// DB - Update every application
		const appRoute = 'users/' + User.email + '/applications';
		const q = query(collection(db, appRoute), where('Term', '==', term));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach(async (app) => {
			const route = 'users/' + User.email + '/applications/' + app.id;
			const docRef = doc(db, route);
			await dataHandlers.updateResumeCount(app.data().resume, "decrement")
			await deleteDoc(docRef);
		});

		// DB - Update list of terms
		const termRoute = 'users/' + User.email;
		const termRef = doc(db, termRoute);
		await updateDoc(termRef, {
			terms: arrayRemove(term)
		});

		// UPDATE LOCAL STORAGE
		if (termRef) {
			authStore.update((curr) => {
				curr.apps = curr.apps.filter((app) => app.Term != term)
				curr.terms = curr.terms.filter((t) => t != term)
				console.log("Apps:")
				console.log(curr.apps)
				return curr;
			});
		}
	},

	// ADD INTERVIEW
	addInterview: async (id, interview) => {
		// UPDATE DB
		const keyName = 'Interviews.' + interview;
		const route = 'users/' + User.email + '/applications/' + id;
		const docRef = doc(db, route);

		await updateDoc(docRef, {
			['Interviews.' + interview]: 'Pending'
		});

		// UPDATE LOCAL STORAGE
		if (docRef) {
			authStore.update((curr) => {
				const indx = curr.apps.findIndex((app) => app.Id === id);
				curr.apps.at(indx).Interviews.push([interview, 'Pending']);
				return curr;
			});
		}
	},

	// REMOVE INTERVIEW
	removeInterview: async (id, key) => {
		// UPDATE DB
		const route = 'users/' + User.email + '/applications/' + id;
		const docRef = doc(db, route);

		await updateDoc(docRef, {
			['Interviews.' + key]: deleteField()
		});

		// UPDATE LOCAL STORAGE
		authStore.update((curr) => {
			const appIndx = curr.apps.findIndex((app) => app.Id === id);
			const app = curr.apps.at(appIndx);
			const getIndx = () => {
				for (var i = 0; i < app.Interviews.length; i++) {
					if (app.Interviews[i][0] === key) return i;
				}
				return -1;
			};
			const intIndx = getIndx();

			if (intIndx >= 0) curr.apps.at(appIndx).Interviews.splice(intIndx, 1);
			else console.log('here');
			return curr;
		});
	},

	// UPDATE INTERVIEW
	updateInterview: async (id, key, value) => {
		// UPDATE DB
		const route = 'users/' + User.email + '/applications/' + id;
		const docRef = doc(db, route);
		let updatedValue = 'Rejected';

		if (value === 'Pending') updatedValue = 'Advanced';
		else if (value === 'Advanced') {
			updatedValue = 'Rejected';
			dataHandlers.updateStatus(id, false);
		} else if (value === 'Rejected') updatedValue = 'Pending';

		await updateDoc(docRef, {
			['Interviews.' + key]: updatedValue
		});

		// UPDATE LOCAL STORAGE
		authStore.update((curr) => {
			const appIndx = curr.apps.findIndex((app) => app.Id === id);
			const app = curr.apps.at(appIndx);
			const getIndx = () => {
				for (var i = 0; i < app.Interviews.length; i++) {
					if (app.Interviews[i][0] === key) return i;
				}
				return -1;
			};
			const intIndx = getIndx();

			if (intIndx >= 0) curr.apps.at(appIndx).Interviews[intIndx][1] = updatedValue;

			return curr;
		});
	},

	// UPDATE PLATFORM
	updatePlatform: async (id, platform) => {
		// UPDATE DB
		if (platform && id) {
			const route = 'users/' + User.email + '/applications/' + id;
			const docRef = doc(db, route);
			await updateDoc(docRef, {
				Platform: platform
			});
		}
	},

	// UPDATE TOPICS
	updateTopics: async (id, topics) => {
		if (topics && id) {
			// UPDATE DB
			const route = 'users/' + User.email + '/applications/' + id;
			const docRef = doc(db, route);
			try {
				await updateDoc(docRef, {
					Topics: topics
				});
			}catch(e){}
		}
	},

	// UPDATE NOTES
	updateNotes: async (id, note) => {
		// UPDATE DB
		const route = 'users/' + User.email + '/applications/' + id;
		const docRef = doc(db, route);

		await updateDoc(docRef, {
			Notes: note
		});

		// UPDATE LOCAL STORAGE
		if (docRef) {
			authStore.update((curr) => {
				const indx = curr.apps.findIndex((app) => app.Id === id);
				curr.apps.at(indx).Notes = note;
				return curr;
			});
		}
	},

	// SEND REQUEST
	sendReq: async (email) => {
		// Confirm user exists
		const recRef = doc(db, `users/${email}`);
		const recSnap = await getDoc(recRef);
		if (!recSnap.exists()) return false;

		// Confirm that user is not already a friend
		for (var i = 0; i < friends.length; i++) {
			if (friends[i].email.localeCompare(email) === 0 || email.localeCompare(User.email) === 0)
				return false;
		}

		// Get user information
		const recUser = {
			email: email,
			name: recSnap.data().name,
			university: recSnap.data().university
		};
		const sendUser = {
			email: User.email,
			name: User.displayName,
			university: univ
		};

		// Update sender's list of sent request
		const senderRoute = 'users/' + User.email;
		const senderRef = doc(db, senderRoute);

		// Update sender's list of sent request
		await updateDoc(senderRef, {
			sentReqs: arrayUnion(recUser)
		});

		// Update recepients list of received request
		await updateDoc(recRef, {
			rcvdReqs: arrayUnion(sendUser)
		});

		// UPDATE LOCAL STORAGE
		authStore.update((curr) => {
			curr.sentReqs.push(recUser);
			return curr;
		});
		return true;
	},

	// ACCEPT REQUEST
	acceptReq: async (req) => {
		// Sender
		const senderRef = doc(db, `users/${req.email}`);

		// Receiver
		const recRoute = 'users/' + User.email;
		const recRef = doc(db, recRoute);
		const recUser = {
			email: User.email,
			name: User.displayName,
			university: univ
		};

		// Move each user from recv/sent to the friends list - Receiver
		await updateDoc(recRef, {
			rcvdReqs: arrayRemove(req),
			friends: arrayUnion(req)
		});
		// Move each user from recv/sent to the friends list - Sender
		await updateDoc(senderRef, {
			sentReqs: arrayRemove(recUser),
			friends: arrayUnion(recUser)
		});

		// UPDATE LOCAL STORAGE
		authStore.update((curr) => {
			// Remove request
			const indx = curr.rcvdReqs.findIndex((r) => r.email === req.email);
			curr.rcvdReqs.splice(indx, 1);

			// Add friend
			curr.friends.push(req);
			return curr;
		});
		return true;
	},

	// ACCEPT REQUEST
	denyReq: async (req) => {
		// Sender
		const senderRef = doc(db, `users/${req.email}`);

		// Receiver
		const recRoute = 'users/' + User.email;
		const recRef = doc(db, recRoute);
		const recUser = {
			email: User.email,
			name: User.displayName,
			university: univ
		};

		// Move each user from recv/sent to the friends list - Receiver
		await updateDoc(recRef, {
			rcvdReqs: arrayRemove(req)
		});
		// Move each user from recv/sent to the friends list - Sender
		await updateDoc(senderRef, {
			sentReqs: arrayRemove(recUser)
		});

		// UPDATE LOCAL STORAGE
		authStore.update((curr) => {
			// Remove request
			const indx = curr.rcvdReqs.findIndex((r) => r.email === req.email);
			curr.rcvdReqs.splice(indx, 1);
			return curr;
		});
		return true;
	},

	getFriend: async (friend) => {
		// Get applications, terms, and friends from DB
		const appRoute = `users/${friend.email}/applications`;
		const friendRef = doc(db, `users/${friend.email}`);
		const friendDoc = await getDoc(friendRef);
		console.log('Friend: ' + friendDoc.data().name);
		const querySnpsht = await getDocs(collection(db, appRoute));
		const tempApps = [];

		// Iterate through data
		querySnpsht.forEach((doc) => {
			// Get data
			let docData = doc.data();

			// Add reference to get doc from DB
			docData.Id = doc.id;

			console.log('App: ' + docData);
			tempApps.push(docData);
		});

		// Update DB
		const userDoc = doc(db, `users/${User.email}`);
		await updateDoc(userDoc, {
			'friend.email': friend.email,
			'friend.name': friendDoc.data().name,
			'friend.apps': tempApps,
			'friend.terms': friendDoc.data().terms,
			'friend.resumes': friendDoc.data().resumes
		});

		// Update local store
		authStore.update((curr) => {
			curr.friend.email = friend.email;
			curr.friend.name = friendDoc.data().name;
			curr.friend.apps = tempApps;
			curr.friend.terms = friendDoc.data().terms;
			curr.friend.resumes = friendDoc.data().resumes;
			return curr;
		});
	},

	removeFriend: async (friend) => {
		const userDoc = doc(db, `users/${User.email}`);
		const friendDoc = doc(db, `users/${friend.email}`);

		// Remove friend from friends list 
		await updateDoc(userDoc, {
			"friends" : arrayRemove(friend)
		});

		// From user from friend's friend list
		await updateDoc(friendDoc, {
			"friends" : arrayRemove({name: userInfo.name, university: userInfo.university, email: User.email})
		});

		authStore.update((curr) => {
			curr.friends.splice(curr.friends.indexOf(friend), 1)
			return curr;
		});
	},	

	deleteAccount: async () => {
		// Iterate through friend's emails and remove the current user from their friend's list
		for (let i = 0; i < friends.length; i++) {
			const friendRef = doc(db, `users/${friends.at(i).email}`);

			await updateDoc(friendRef, {
				friends: arrayRemove({ name: User.displayName, email: User.email, university: univ })
			});
		}

		// Delete current user's document
		const userDoc = doc(db, `users/${User.email}`);
		await deleteDoc(userDoc);

		// Remove user from authentication system
		const auth = getAuth();
		const user = auth.currentUser;
		deleteUser(user)
			.then(() => {
				// User deleted.
				console.log('User deleted');
			})
			.catch((error) => {
				// An error ocurred
			});

		// Redirect to landing page
		window.location.href = '/';
	},

	updateAccount: async (req) => {
		// Request will contain name, university, resume file
		const userDoc = doc(db, `users/${User.email}`);
        const docSnap = await getDoc(userDoc); 
		const userData = docSnap.data(); 
		

		// Update name
		if (req.name != undefined && req.name.charAt(0) != ' ') {
			await updateDoc(userDoc, {
				name: req.name
			});
			authStore.update((curr) => {
				curr.name = req.name
				console.log(curr.user)
				return curr;
			});
		}

		// Update university
		if (req.university != undefined) {
			await updateDoc(userDoc, {
				university: req.university
			});
			authStore.update((curr) => {
				curr.university = req.university
				return curr;
			});
		}

		// Upload resume and set as default
        if (req.resume != undefined) {
			let resumeName = req.resume.name.slice(0, req.resume.name.indexOf(".")); 
			console.log("resume name: " + resumeName)
            const storageRef = ref(storage, `users/${User.email}/${req.resume.name}`)
			// Verify resume name is unique
			if (resumeName in userData?.resumes)
				return false;
			
			// Upload resume 
			await uploadBytes(storageRef, req.resume);
			const url = await getDownloadURL(storageRef);

			// Add resume to list of resumes
			await updateDoc(userDoc, {
				[`resumes.${resumeName}`]: {name:req.resume.name, url:url, count:0}
			});
			// Update user's default resume
			await updateDoc(userDoc, {
				resume: resumeName
			});
			authStore.update((curr) => {
				curr.resume = resumeName
				return curr;
			});

			
			authStore.update((curr) => {
				curr.resumes[`${resumeName}`] = {name:req.resume.name, url:url, count:0}
				return curr;
			});
        }
	},

	updateDefaultResume: async (resumeName) => {		
		const route = 'users/' + User.email;
		const docRef = doc(db, route);

		// Update application's resume
		await updateDoc(docRef, {
			"resume": resumeName
		});
	},

	updateResumeCount: async (resumeName, command) => {
		if (resumeName === "") 
			return;

		const userDoc = doc(db, `users/${User.email}`);
		// Update document with this name
		switch(command) {
			case "increment":
				await updateDoc(userDoc, {
					[`resumes.${resumeName}.count`]: increment(1)
				});
				authStore.update((curr) => {
					console.log(curr.resumes)
					console.log(resumeName)
					curr.resumes[resumeName].count++;
					return curr;
				});
				break;
			case "decrement":
				const snapSht = await getDoc(userDoc)
				if (snapSht.data().resumes[resumeName].count > 0) {
					await updateDoc(userDoc, {
						[`resumes.${resumeName}.count`]: increment(-1)
					});
					authStore.update((curr) => {
						console.log("Resumes: ")
						console.log(curr.resumes)
						curr.resumes[resumeName].count--;
						console.log(curr.resumes[resumeName].count)
						return curr;
					});
				}
				break;
		}
	}, 

	updateAppResume: async (id, newResume, oldResume) => {		
		const route = 'users/' + User.email + '/applications/' + id;
		const docRef = doc(db, route);

		// Update application's resume
		await updateDoc(docRef, {
			"resume": newResume
		});

		// Update resume counts
		await dataHandlers.updateResumeCount(newResume, "increment")
		await dataHandlers.updateResumeCount(oldResume, "decrement")
	},

	removeResume: async (resumeName) => {		
		// DB - Update every application
		const appRoute = 'users/' + User.email + '/applications';
		const q = query(collection(db, appRoute), where('resume', '==', resumeName));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach(async (app) => {
			const route = 'users/' + User.email + '/applications/' + app.id;
			const docRef = doc(db, route);

			// Update application's resume
			await updateDoc(docRef, {
				"resume": ""
			});
		});
		authStore.update((curr) => {
			curr.apps.map((app) => {
				if(app.resume.localeCompare(resumeName) == 0)
					return {...app, resume: ""}
			})
			return curr;
		})


		// Delete file from storage
		const pdfRef = ref(storage, `users/${User.email}/${resumeName}.pdf`);
		await deleteObject(pdfRef)

		// Delete resume from resumes
		const resumesRef = 'users/' + User.email;
		const resumesDoc = doc(db, resumesRef)
		await updateDoc(resumesDoc, {
			[`resumes.${resumeName}`] : deleteField()
		})
		authStore.update((curr) => {
			delete curr.resumes[`${resumeName}`]
			// curr.resumes.delete(resumeName)
			return curr;
		})

		// Update default resume
		const resumeRef = 'users/' + User.email;
		const resumeDoc = doc(db, resumeRef)
		if (userInfo.resumes.length >= 1) {
			await updateDoc(resumeDoc, {
				"resume" : Object.entries(userInfo.resumes)[0][0]
			})
			authStore.update((curr) => {
				curr.resume = Object.entries(userInfo.resumes)[0][0]
				return curr;
			})
		} else {
			await updateDoc(resumeDoc, {
				"resume" : ""
			})
			authStore.update((curr) => {
				curr.resume = ""
				return curr;
			})
		}	
	},
};
