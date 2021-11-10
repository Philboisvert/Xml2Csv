const spreadsheetsPath = "/spreadsheets/";
const xmlPath = "/xmlFiles/";
const xmlFolder =  __dirname + "/xmlFiles";
const csvFr = "fr.csv";
const csvEn = "en.csv";

const fs = require('fs');
const convert = require('xml-js');
const { writeToPath } = require('@fast-csv/format');

fs.readdir(xmlFolder,  (err, file) => {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    let engFiles = [];
    let frFiles = [];
    //Node needed
    let tempArrayEng = [ ['Slug', 'Keywords', 'Title', 'Description']];
    let tempArrayFr = [['Slug', 'Keywords', 'Title', 'Description']];
    //fast-csv options
    const options = { 
      headers: true,
      quoteColumns: true,
      writeBOM: true,
      quote: false
    };

    //Parsing all XML files to JSON and filtering ENG/FR
    for (var i = 0; i < file.length; i++) {
      let xmlFile = fs.readFileSync(__dirname + xmlPath + file[i], 'utf8');
      let jsonData = JSON.parse(convert.xml2json(xmlFile, {compact: true, spaces: 2}));
      let targetNode = jsonData.smartTips.smartTip.languages.language._text
      targetNode === 'en_CA' ? engFiles.push(jsonData) : frFiles.push(jsonData);
    }

    engFiles.forEach(function(e) {
      let description = e.smartTips.smartTip.seo.description._cdata;
      let title = e.smartTips.smartTip.seo.title._cdata;
      let keywords = e.smartTips.smartTip.seo.keywords._cdata;
      let slug = e.smartTips.smartTip.slug._cdata;
      
      let myArray = [slug, keywords, title, description];
      tempArrayEng.push(myArray);
    });

    frFiles.forEach(function(e) {
      let description = e.smartTips.smartTip.seo.description._cdata;
      let title = e.smartTips.smartTip.seo.title._cdata;
      let keywords = e.smartTips.smartTip.seo.keywords._cdata;
      let slug = e.smartTips.smartTip.slug._cdata;
      
      let myArray = [slug, keywords, title, description];
      tempArrayFr.push(myArray);
    });

    writeToPath(__dirname + spreadsheetsPath + csvEn , tempArrayEng, options)
        .on('error', err => console.error(err))
        .on('finish', () => console.log('Done writing ENG.'));

    writeToPath(__dirname + spreadsheetsPath + csvFr , tempArrayFr, options)
        .on('error', err => console.error(err))
        .on('finish', () => console.log('Done writing FR.'));
});


