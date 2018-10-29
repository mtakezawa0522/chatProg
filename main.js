var app = new Vue({
    el: '#app',
    data: {
        message: '',
        items: []
    },
    computed: {

    },
    created: function() {
        ref_message = firebase.database().ref('message')
        ref_message.limitToLast(10).on('child_added', this.childAdded)
    },
    methods: {
        childAdded(snap) {
            const message = snap.val()
            this.items.push({
                val: message.message,
                date: message.date
            })
        },
        doSend: function() {
            if(this.message.length) {
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
