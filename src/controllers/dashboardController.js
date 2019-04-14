import electron from 'electron';
import fs from 'fs';
import dashboardService from '../services/dashboardService';

const dialog = electron.remote.dialog;

const getReportBtn = document.getElementById('getReportBtn');

getReportBtn.addEventListener('click', (event) => {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;
  const fundFilePath = document.getElementById('fundFilePath').files[0].path;

  dashboardService.generateDashboard(fundFilePath, new Date(start), new Date(end))
    .then((dashboard_content) => {
      dialog.showSaveDialog((fileName) => {
        if (fileName === undefined) {
          console.log("You didn't save the file");
          return;
        }

        // fileName is a string that contains the path and filename created in the save file dialog.
        fs.writeFile(fileName, dashboard_content, (err) => {
          if (err) {
            alert(`An error ocurred creating the file ${err.message}`);
          }
          alert('The file has been succesfully saved');
        });
      });
    });
});
