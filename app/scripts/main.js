// issues
//      App.Models.Task's Validate is not working even with {validate: true}

window.App = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {}
};

window.template = function (id) {
    return _.template( $('#' + id).html() );
}

$(document).ready(function () {
    'use strict';
    
    // 
    App.Models.Task = Backbone.Model.extend({
        validate: function (attrs) {
            debugger;
            console.log(attrs);
            if ( ! $.trim(attrs.title) ) {
                return 'A task requires a valid title';
            }
        } 
    });

    // 
    App.Collections.Tasks = Backbone.Collection.extend({
        Mddel: App.Models.Task
    });

    // 
    App.Views.Tasks = Backbone.View.extend({
        tagName: 'ul',

        initialize: function () {
            this.collection.on('add', this.addOne, this)
        },

        render: function () {
            // console.log(this.collection);
            this.collection.each(this.addOne, this);
            return this;
        },

        addOne: function (task) {
            // console.log(task);
            var taskView = new App.Views.Task({ model: task });
            this.$el.append( taskView.render().el );
        }
    });

    // 
    App.Views.Task = Backbone.View.extend({
        tagName: 'li',

        template: template('taskTemplate'),

        initialize: function () {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        }, 

        events: {
            'click .edit': 'editTask',
            'click .delete': 'destroy'
        },

        editTask: function () {
            var newTaskTitle = prompt('Change to?', this.model.get('title'));
            this.model.set('title', newTaskTitle, {validate: true});
        },

        destroy: function () {
            this.model.destroy();
            console.log(tasksCollection);
        },

        remove: function () {
             this.$el.remove();  
        },
        
        render: function () {
            // console.log(this.model);
            var template = this.template(this.model.toJSON());
            this.$el.html( template );
            return this;
        }  
    });

    App.Views.AddTask = Backbone.View.extend({
        el: '#addTask',

        events: {
            'submit': 'submit'
        },

        initialize: function () {
            
        },

        submit: function (e) {
            e.preventDefault();

            var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();

            var task = new App.Models.Task({title: newTaskTitle});
            
            this.collection.add(task);
        }
    });

    // var task = new App.Models.Task({
    //     title: 'Go to the store',
    //     priority: 4
    // })

    var tasksCollection = new App.Collections.Tasks([
    {
        title: 'Go to store',
        priority: 4
    },
    {
        title: 'Go to the mall',
        priority: 3 
    },
    {
        title: 'Go to work',
        priority: 5 
    }
    ]);

    var addTasksView = new App.Views.AddTask({ collection: tasksCollection });

    var tasksView = new App.Views.Tasks({ collection: tasksCollection });
    tasksView.render();
    // console.log(tasksView.el);
    $('.tasks').html(tasksView.el);
});

