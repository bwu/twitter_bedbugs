var just_edited;

(function($) {
    
    var app = $.sammy('#content', function() {

        // Route to invite
        this.get('#/', function(context) {
            context.redirect('#/search/');
        });

        // Route to invite
        this.get('#/search/', function(context) {
            loadTab('search');
        });

        // Route to invite
        this.get('#/submit/', function(context) {
            $('.alert').remove();
            just_edited = false;
            loadTab('submit');
        });

        // Route to invite
        this.get('#/admin/', function(context) {
            loadTab('admin');
        });

        // Route for reg form submission
        this.post('#/submit/form/', function(context) { 
            // Validate form based on defined requirements
            var validatedForm = validateForm({
                name: 'required',
                email: 'required',
                hide_name: {type:'checkbox', data:$('#hide_name').is(':checked')},
                academic_year_1: 'required',
                academic_year_2: 'required',
                type: {type:'checkboxes', data:$('input[name=type]:checked').map(function(){return $(this).val();}).get()},
                program: {type:'radio', data:$('input[name=program]:checked').map(function(){return $(this).val();}).get()},
                city: 'required',
                state: 'required_state',
                country: 'required',
                mentor_name: 'required',
                mentor_department: 'required',
                mentor_description: 'required',
                scholarship: {type:'radio', data:$('input[name=scholarship]:checked').map(function(){return $(this).val();}).get()},
                specialty: {type:'checkboxes', data:$('input[name=specialty]:checked').map(function(){return $(this).val();}).get()},
                keywords: {type:'checkboxes', data:$('input[name=keywords]:checked').map(function(){return $(this).val();}).get()},
                project_title: 'required',
                daily_responsibilities: 'required',
                lab_environment: 'required',
                publication: {type:'radio', data:$('input[name=publication]:checked').map(function(){return $(this).val();}).get()}
            }, context.target);
            if (validatedForm.isValid) {
                $.post('./models/submit.php', {data:validatedForm.fields, just_edited:just_edited}, function(resp) {
                    session_items = resp;
                    $('.alert').remove();
                    if (just_edited) {
                        $('#content').before('<div id="success_alert" class="alert container"><button type="button" class="close" data-dismiss="alert">&times;</button>Project successfully edited.</div>');
                        context.redirect('#/admin/');
                    } else {
                        $('#content').before('<div id="success_alert" class="alert container"><button type="button" class="close" data-dismiss="alert">&times;</button>Your project has been submitted for approval.</div>');
                        context.redirect('#/search/');
                    }
                }, 'json');
            } else {
                // Show error message
                $('html, body').animate({
                     scrollTop: $('.error').first().offset().top-100
                 }, 750);
            }
        });

        // Route to an individual story's template
        this.get('#/project/:id', function(){
            var project_id = this.params['id'];
            loadTab('view', function(resp){
                // Fill in the template for the stories page
                var item = session_items[project_id];
                item.location = (item.country == 'United States') ? item.city + ', ' + item.state : item.city + ', ' + item.country;
                if (item.hide_name == 'false') {
                    $('.project_name').text(item.name);
                    $('#project_email').text(item.email);
                } else {
                    $('.project_name').text('--');
                    $('#project_email').text('--');
                }
                $('#project_academic_year_1').text(item.academic_year_1);
                $('#project_academic_year_2').text(item.academic_year_2);
                $('#project_scholarship').text(item.scholarship);
                $('#project_publication').text(item.publication);
                $('#project_type').text(item.type.join(', '));
                $('#project_specialty').text(item.specialty.join(', '));
                $('#project_keywords').text(item.keywords.join(', '));
                $('#project_program').text(item.program);
                $('#project_location').text(item.location);
                $('#project_mentor_name').text(item.mentor_name);
                $('#project_department').text(item.mentor_department);
                $('.project_title').text(item.project_title);
                $('#project_daily_responsibilities').text(item.daily_responsibilities);
                $('#project_lab_environment').text(item.lab_environment);
            });
        });

        // Route to an individual story's template
        this.get('#/edit/:id', function(){
            $('.alert').remove();
            just_edited = true;
            var project_id = this.params['id'];
            loadTabWithParams('submit', {id:project_id}, function(resp){
                // Fill in the template for the stories page
                var item = session_items[project_id];
                var simple_fields = ['name', 'email', 'academic_year_1', 'academic_year_2', 'city', 'state', 'country', 'mentor_name', 'mentor_department', 'mentor_description', 'project_title', 'daily_responsibilities', 'lab_environment'];
                $.each(simple_fields, function() {
                    $('#'+this).val(item[this]);
                });
                var difficult_fields = ['type', 'program', 'scholarship', 'specialty', 'keywords', 'publication'];
                $.each(difficult_fields, function() {
                    if ($.isArray(item[this])) {
                        for (var checked_box in item[this]) {
                            if ($('input[name="'+this+'"][value="'+item[this][checked_box]+'"]').length != 0) {
                                $('input[name="'+this+'"][value="'+item[this][checked_box]+'"]').prop("checked",true);
                            } else {
                                $('input[name="'+this+'"][value="__option__"]').prop("checked",true);
                                $('input[name="'+this+'_other_option"]').val(item[this][checked_box]);
                            }
                        }
                    } else {
                        if ($('input[name="'+this+'"][value="'+item[this]+'"]').length == 0) {
                            $('input[name="'+this+'"][value="__option__"]').prop("checked",true);
                            $('input[name="'+this+'_other_option"]').val(item[this]);
                        } else {
                            $('input[name="'+this+'"][value="'+item[this]+'"]').prop("checked",true);
                        }
                    }
                });
                $('#hide_name').prop('checked', item['hide_name']=='true');
            });
        });


    });

    // Client side validation
    var validateForm = function(fields, element) {
      var valid = true;
      $.each(fields, function(key, value) {
        if (value == 'required') {
            var form_val = $('#'+key).val();
            if (!form_val.length) {
                $('#'+key).addClass('error');
                valid = false;
            } else {
                $('#'+key).removeClass('error');
                fields[key] = form_val;
            }
        } else if (value == 'required_state') {
            var form_val = $('#'+key).val();
            if ($('#country').val() == 'United States' && !form_val.length) {
                $('#'+key).addClass('error');
                valid = false;
            } else {
                $('#'+key).removeClass('error');
                fields[key] = form_val;
            }
        } else if ($.isPlainObject(value)) {
            if (value.type == "checkbox") {
                fields[key] = value.data;
            } else if (!value.data.length) {
                $('#'+key).addClass('error');
                $('#'+key).show();
                valid = false;
            } else {
                $('#'+key).removeClass('error');
                $('#'+key).hide();
                if (value.type == "checkboxes") {
                    var option_index = $.inArray("__option__", value.data);
                    if (option_index > -1) {
                        value.data[option_index] = $('input[name='+key+'_other_option]').val();
                    }
                    fields[key] = value.data;
                } else {    //Error occuring around here with IE8. What is it?
                    if (value.data[0] == "__option__") {
                        fields[key] = $('input[name='+key+'_other_option]').val();
                    } else {
                        fields[key] = value.data[0];
                    }
                }
            }
        } else if (fields[key] && fields[key] == 'optional') {
          fields[key] = $('#'+key);
        }
      });

      return {
        'isValid': valid,
        'fields': fields
      };
    };

    $(function() {
        app.run('#/');
    });


    
})(jQuery);