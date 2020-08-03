const { remote } = window.require('electron')
const { BrowserWindow } = remote

module.exports = function () {
  return new Promise((resolve, reject) => {
    /*
    var sec65options = {
      format: 'A4',
      border: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    }*/
    var sec65template = `
  <style>

  html {
    zoom: 0.75;
    text-align: center;
    font-family: sans-serif;
    align-items: center;
    align-content: center;
    align-self: center;

  }
  p, ul, li {
   size: 16px;
   text-align: justify;
  }
  .nameSig {
    text-align: left;
  }
</style>
<html>
<h1>CERTIFICATE</h1>
<h2>(Under Section 65 B of Evidence Act)</h2>


<p>
I state that I have produced the printouts attached which are true and accurate copies from the internet captured through the service provided by www.expertevidence.org for the URLs and the dates specified in the metadata. This was done under my supervision with no tampering or attempt to tamper the documents  done by me or any third party. The attached documents, therefore in the facts and circumstance of the case is sufficient compliance of Section 65 B of the Evidence Act.
<br><br>
Expert Evidence has created a service for Web Archiving which works as a Chrome Extension. This service allows extraction of web pages in human and machine readable format along with subcutaneous memory, thus mirror image of the electronic media where it is originally stored. The files are time stamped and stored with secure chain of custody. The human readable form of the webpage in pdf format and the metadata in pdf could be presented as printouts.
<br><br>
Files included in the downloadable folder are:<br>
<ul>
<li>Metadata.json - Consist of metadata in json format for future verification</li>
<li>Screenshot.pdf - Image format of rendered website in pdf</li>
<li>Warc - Standard web archiving format. Contains all datas including images</li>
<li>Metadata.pdf - Readable format of metadata in pdf</li>
</ul>
</p>

<div class="nameSig">
  <br><br><br>
  Name : <br><br>
  Signature :
</div>
</html>  `

    let win = new BrowserWindow({ show: false })
    win.loadURL('data:text/html;charset=utf-8,' + sec65template)
    win.webContents.on('did-finish-load', () => {
      win.webContents
        .printToPDF({})
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          console.log(error)
        })
    })
  })
}
