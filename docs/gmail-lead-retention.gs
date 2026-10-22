// Google Apps Script for the brofixapp@gmail.com account (script.google.com).
// Privacy policy, section 5: website-form details are deleted 12 months after the request.
// Lead emails are matched by the subjects the /pros form sets (src/pages/*/pros.html).
// older_than:11m + Gmail's 30-day trash purge = gone by month 12.

const LEAD_QUERY = '(subject:"בעל מקצוע חדש מהאתר" OR subject:"New pro from the site") older_than:11m';

function deleteOldLeads() {
  let threads;
  do {
    threads = GmailApp.search(LEAD_QUERY, 0, 100);
    if (threads.length) GmailApp.moveThreadsToTrash(threads);
  } while (threads.length === 100);
}

// Run once by hand: schedules deleteOldLeads every day at about 03:00.
function installDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('deleteOldLeads').timeBased().everyDays(1).atHour(3).create();
}
