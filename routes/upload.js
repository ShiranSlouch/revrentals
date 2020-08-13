const DatabaseManager = require('./../db');
const path = require('path')

const moment = require('moment');


const getList = async(req, res, tag, title, limit = 10) => {
    try {

        const filters = {};

        
        const db = DatabaseManager.get(req.cookies.revrentals);
        const result = await db('uploads')
            .where(filters)
            .select()
           // .orderBy('week', 'desc')
        
        const uploads = result.map(item => {
            item.date = moment(item.created_at).format('YYYY-MM-DD H:mm:ss');
            item.name = moment(item.date_of_availability).format('YYYY-MM-DD');
            return item;
        });
        res.render('home', {
            user: req.user, 
            title: title,
            uploads: uploads,
            partials: { header: 'header' }
        });

    } catch(e) {
        res.redirect('/index');
    }

};

module.exports = {
    getHomePage: async(req, res) => {

        const db = DatabaseManager.get(req.cookies);
        console.log(req.user);
        try {
            const result = await db('uploads')
                .select()
                console.log(result);
            const uploads = result.map(item => {
                item.date_of_availability = moment(item.date_of_availability).format('YYYY-MM-DD');
                return item;
            });

            res.render('home', {
                user: req.user, 
                title: 'List',
                upload: uploads,
                partials: { header: 'header' }
            });


        } catch(e) {
            console.error(e);
            res.redirect('/index');
        }

    },

    

    getAll(req, res) {
        getList(req, res, null, 'All');
    },

    addFile: async(req, res) => {
        if (!req.files && req.files.file) {
            return res.status(400).send("No files were uploaded.");
        }

        const db = DatabaseManager.get(req.cookies.revrentals);
        let message = '';
        let date_of_availability = req.body.date_of_availability;
        let uploadedFile = req.files.file;

        try {

            const file = await db("uploads").where("date_of_availability", date_of_availability);
            console.log('File', file);

                     
            const location = `public/assets/pic/${req.body}/${date_of_availability}.pdf`;

            await uploadedFile.mv(location);
            await db("uploads").insert({ 
                date_of_availability, 
                file: location, 


            });
            res.redirect("/home")

        
        } catch(err) {
            res.status(500).send(err.message);
        }

    },

    addFilePage: async(req, res) => {

        try {
            const db = DatabaseManager.get(req.cookies.revrentals);
            
            res.render('home', {
                user: req.user,
                title: "Add a new file"
                ,message: '',
                partials: { header: 'header' }
            });
        } catch(e) {
            console.log(e);
            res.redirect('/index');
        }
        
    },
    addFileOld: async(req, res) => {
        if (!req.files) {
            return res.status(400).send("No picture were uploaded.");
        }
        
        const db = DatabaseManager.get(req.cookies.revrentals);
       
        let message = '';
        let date_of_availability = req.body.date_of_availability;
        
        try {

            const file = await db("uploads").where("date_of_availability", date_of_availability);
            const file2 = await db("uploads").where("date_of_availability", date_of_availability);
            console.log('File', file);
            console.log('File', file2);
            
            
            const PicLocation = `public/assets/pic/${picture}`;
           
            
            await db("uploads").insert({ date_of_availability, PicLocation: picLocation });

            res.redirect("/home")

        
        } catch(err) {
            res.status(500).send(err.message);
        }
   },
};
