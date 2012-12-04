(function($){

    $(document).ready(function($) {
        lightbox.init();
    });

    $.fn.center = function () {
        this.css("position","absolute");
        this.css("top", Math.max(0, (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop()) + "px");
        this.css("left", Math.max(0, (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft()) + "px");
        return this;
    }

    var lightbox = {
        init : function(){
            $('img.lb').click(function(e) {
                e.preventDefault();
                var image_href = $(this).attr('lb-url');
                if (!image_href){
                    var image_href = $(this).attr('src');       
                }
                 
                var exists = $('#lightbox-overlay').length; 
                if (!exists) {
                    var markup = '<div id="lightbox"></div><div id="lightbox-overlay"></div>';     
                    $('body').append(markup);
                } else {
                    $('#lightbox').html('');    
                }

                var $lightbox = $('#lightbox');
                var $overlay = $('#lightbox-overlay');
                
                $lightbox.hide();
                var img = document.createElement('img');
                img.setAttribute('src', image_href);
                img.setAttribute('class', 'polaroid');
                img.onload = function(){
                    $overlay.show();
                    $lightbox.center();
                    $lightbox.fadeIn();
                };

                $lightbox.append(img);
            });
         
            $('#lightbox-overlay').live('click', function() {
                $(this).hide();
                $('#lightbox').hide();
            }); 

            $(window).bind('resize', function() {
                $("#lightbox").center();
            }); 
        }
    };

})(jQuery)