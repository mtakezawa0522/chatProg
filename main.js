var app = new Vue({
    el: '#app',
    data: {
        message: '',
        items: [],
        user: {}
    },
    computed: {

    },
    created: function() {
        firebase.auth().onAuthStateChanged(user => {
            this.user = user ? user : {}
            ref_message = firebase.database().ref('message')
            if(user) {
                this.items = []
                ref_message.limitToLast(10).on('child_added', this.childAdded)
            } else {
                ref_message.limitToLast(10).off('child_added', this.childAdded)
            }
        })
    },
    methods: {
        // Login処理
        doLogin() {
            var PROVIDER = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(PROVIDER)
        },
        doLogout() {
            firebase.auth().signOut()
        },
        childAdded(snap) {
            const message = snap.val()
            this.items.push({
                val: message.message,
                date: message.date
            })
        },
        doSend: function() {
            // ログインしていてメッセージが入っていること
            if(this.user.uid && this.message.length) {
                var now = new Date()
                var tmpYear = now.getFullYear().toString()
                var tmpMonth = now.getMonth().toString()
                var tmpDate = now.getDate().toString()
                var tmpDay = now.getDate().toString()
                var tmpHour = now.getHours().toString()
                var tmpMinutes = now.getMinutes().toString()
                var dateVal = tmpYear+'/'+tmpMonth+'/'+tmpDate+' '+tmpHour+':'+tmpMinutes

                // firebaseにメッセージ送信
                firebase.database().ref('message').push({
                    message: this.message,
                    date: dateVal,
                })
                this.message = ''
            }
        }
    }
})
