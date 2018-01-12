(function (cloudStack) {
    cloudStack.plugins.csMyFirstPlugin = function(plugin) {
        plugin.ui.addSection({
            id: 'csMyFirstPlugin',
            title: 'My Plugin',
            preFilter: function(args) {
                return isAdmin();
            },

            // Render page as a list view
            listView: {
                id: 'testPluginInstances',
                fields: {
                    name: { label: 'label.name' },
                    instancename: { label: 'label.internal.name' },
                    displayname: { label: 'label.display.name' },
                    zonename: { label: 'label.zone.name' }
                },
                actions: {
                    // The key/ID you specify here will determine what icon is shown in the UI for this action,
                    // and will be added as a CSS class to the action's element
                    // (i.e., '.action.restart')
                    //
                    // -- here, 'restart' is a predefined name in CloudStack that will automatically show
                    //    a 'reboot' arrow as an icon; this can be changed in csMyFirstPlugin.css
                    restart: {
                        label: 'Restart VM',
                        messages: {
                            confirm: function() { return 'Are you sure you want to restart this VM?' },
                            notification: function() { return 'Rebooted VM' }
                        },
                        action: function(args) {
                            // Get the instance object of the selected row from context
                            //
                            // -- all currently loaded state is stored in 'context' as objects,
                            //    such as the selected list view row, the selected section, and active user
                            //
                            // -- for list view actions, the object's key will be the same as listView.id, specified above;
                            //    always make sure you specify an 'id' for the listView, or else it will be 'undefined!'
                            var instance = args.context.testPluginInstances[0];

                            plugin.ui.apiCall('rebootVirtualMachine', {
                                // These will be appended to the API request
                                //
                                // i.e., rebootVirtualMachine&id=...
                                data: {
                                    id: instance.id
                                },
                                success: function(json) {
                                    args.response.success({
                                        // This is an async job, so success here only indicates that the job was initiated.
                                        //
                                        // To pass the job ID to the notification UI (for checking to see when action is completed),
                                        // '_custom: { jobID: ... }' needs to always be passed on success, in the same format as below
                                        _custom: { jobId: json.rebootvirtualmachineresponse.jobid }
                                    });
                                },
                                error: function(errorMessage) {
                                    args.response.error(errorMessage); // Cancel action, show error message returned
                                }
                            });
                        },

                        // Because rebootVirtualMachine is an async job, we need to add a poll function, which will
                        // perodically check the management server to see if the job is ready (via pollAsyncJobResult API call)
                        //
                        // The plugin API provides a helper function, 'plugin.ui.pollAsyncJob' which will work for most jobs
                        // in CloudStack
                        notification: {
                            poll: plugin.ui.pollAsyncJob
                        }
                    }
                },
                dataProvider: function(args) {
                    // API calls go here, to retrive the data asynchronously
                    //
                    // -- on successful retrieval, call args.response.success({ data: [data array] });
                    plugin.ui.apiCall('listVirtualMachines', {
                        success: function(json) {
                            var vms = json.listvirtualmachinesresponse.virtualmachine;

                            args.response.success({ data: vms });
                        },
                        error: function(errorMessage) {
                            args.respons.error(errorMessage)
                        }
                    });
                }
            }
        });


        // Add an action to an existing section
        // First, find the correct path to the respective section you want to extend
        // -- standard practice in the UI is to put all actions under the detail view
        var section = cloudStack.sections.events;
        var actions = section.sections.events.listView.detailView.actions;
        // Then, define a new action, using standard widget syntax
        // (see other actions in CloudStack code as examples)
        actions.pluginAction = {
            label: 'Test plugin action', // Label that will appear as alt tag/quickview label
            messages: {
                confirm: function(args) {
                    return 'Please confirm you want this test action performed' // This appears before the action runs
                },
                notification: function(args) {
                    return 'Test plugin action' // This will appear in the notifications box when action is performed
                }
            },
            // Determines whether action will be shown/hidden;
            // this is evaluated on load/refresh of detail view
            //
            // return true to show action, false to hide
            preFilter: function(args) {
                var context = args.context; // Stores any existing JSON data loaded into the UI

                return isAdmin(); // isAdmin() causes action to only be shown to root admins
            },
            action: function(args) {
                // ... ajax calls, etc here
                //
                // -- call args.response.success() when action is completed,
                //    or args.response.error(errorMsg) if there was an error, and pass in errorMsg to display
                args.response.success();
            }
        }
    };
}(cloudStack));