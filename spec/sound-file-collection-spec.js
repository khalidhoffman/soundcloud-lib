let tCollection;
module.exports ={
    before: function(done) {
        user.connect()
            .fetchPlayLists()
            .then(playLists => {
                tCollection = playLists[0];
                done();
            })
            .catch(err => done(err));
    },
    'SoundFileCollection': {
        '#download()':{
            'it should persists a local dir': function(){
                //TODO write test 
                //1. ensure folder doesn't exist before
                //2. ensure folder exists afterward
                //3. delete folder
            }
        }
    }
}
