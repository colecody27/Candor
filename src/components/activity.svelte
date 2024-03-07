<script>
    // While date of applications is within 7 days of current day 
    // Mark it's position within a 7 item array as 1 if 
    // Skip to application that has the next closest day 
    export let apps
    let activity = [0, 0, 0, 0, 0, 0, 0]
    let day = 7
    let appIndx = 0
    let currDate = new Date()

    while (day > 0 && appIndx < apps.length ) {
        const app = apps.at(appIndx)
        const appDate = app.Date.toDate()
        console.log(appDate)
        // If application date is outside of 7 day window, break
        if ( Math.round((currDate.getTime() - appDate.getTime())/(1000 * 3600 * 24)) > 7 ) {
            console.log("broke")
            break
        }
            
        
        const dayDiff = currDate.getDay() - 7 + day - appDate.getDay()
        console.log("Day diff: " + dayDiff)
        // Check if app is on the given day
        if (dayDiff == 0) {
            console.log("Good day")
            activity[day] = 1
            day--
            appIndx++
            continue
        }

        // Move to next application
        day--
    }
</script>

<div class='flex flex-row'>
    <h1>here</h1>
    {#each activity as act}
        {#if act == 0}
            <div class='h-2 w-2 bg-gray-500 m-1'></div>
        {:else}
            <div class='h-2 w-2 bg-red-500 m-1'></div>
        {/if}
    {/each}
</div>

