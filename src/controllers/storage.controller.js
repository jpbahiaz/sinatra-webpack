// Storage Controller
// Bonus module for Local Storage actions
export const StorageController = (function(){
    // Public Methods
    return {
        store: function(key, item){
            let items
            // Check if any items in ls
            if(localStorage.getItem(key) === null){
                items = []
                // Push new item
                items.push(item)
                // Set ls
                localStorage.setItem(key, JSON.stringify(items))
            }else{
                // Get what is already in ls
                items = JSON.parse(localStorage.getItem(key))

                // Push new item
                items.push(item)

                // Re set ls
                localStorage.setItem(key, JSON.stringify(items))
            }
        },
        set: function(key, item){
            localStorage.setItem(key, JSON.stringify(item))
        },
        get: function(key){
            let items
            if(localStorage.getItem(key) === null){
                items = []
            }else{
                items = JSON.parse(localStorage.getItem(key))
            }

            return items
        },
        delete: function(key, id){
            let items = this.get(key)

            items.forEach((item, index) => {
                if(id === item.id){
                    items.splice(index, 1)
                }
            })

            // Re set ls
            localStorage.setItem(key, JSON.stringify(items))
        },
        pop: function(key){
            const items = this.get(key)

            items.pop()
            // Re set ls
            localStorage.setItem(key, JSON.stringify(items))
        },
        clear: function(key){
            localStorage.removeItem(key)
        }
    }
})()