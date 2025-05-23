function fts_ClearCache( notice ) {
    console.log('Clicked Clear Cache function');
    jQuery.ajax({
        data: {
            action: "fts_clear_cache_ajax",
            _wpnonce: ftsAjax.clearCacheNonce
        },
        type: 'POST',
        url: ftsAjax.ajaxurl,
        success: function (response) {
            console.log('Well Done and got this from sever: ' + response);
            if( 'alert' === notice ){
                alert('Cache for all FTS Feeds cleared!');
                window.location.reload();
            }

            return false;
        }
    });
    return false;
}

jQuery(document).ready(function ($) {

    // Set the styles on the admin bar Clear Cache.
    $('#wp-admin-bar-feed_them_social_admin_set_cache div').css('cursor', 'pointer').hover(
        function() {
            $(this).css('color', '#72aee6');
        },
        function() {
            $(this).css('color', '');
        }
    );

    // This code is on the front end of the website to assist in converting old shortcodes to new ones.
    if( !$('body.wp-admin').length ){

        let body = $('body');
        const $ftsTextNodes = body.find('*').contents().filter(function() {
            return this.nodeType === 3 && this.textContent.indexOf('[fts_') === 0;
        });

        $ftsTextNodes.each(function() {
            let text = $(this).text();
            let $div = $('<div>').text(text).addClass('fts-legacy-shortcode').css({'cursor': 'pointer', 'color' : '#ff0000ed' });
            let $legacyDiv = $('<div>').addClass('fts-legacy-shortcode-wrap');
            const $legacySpan = $('<span class="fts-legacy-code-instruction">').text('Only visible to admins. This is a legacy shortcode, click on the shortcode below to start the conversion process.').css('font-weight', 'bold');
            let $successSpan = $('<span>').text('Success, shortcode copied to clipboard. ').addClass('success-message').css('font-weight', 'bold');
            const $successSpan2 = $('<span>').text('After clicking the Next Step link a new Feed post should be created, now paste your old shortcode in the Convert Shortcode widget. Once complete you will replace your old shortcode with the new one. ').addClass('fts-convert-shortcode-message-success');

            let $link = $('<a>').text('Click here for Next Step.').attr('href', ftsAjax.createNewFeedUrl).attr('target', '_blank').addClass('fts-convert-shortcode-next-step-link').append('<br/>') ;
            let $link2 = $('<a>').text('Convert Shortcode Documentation Reference').attr('href', 'https://www.slickremix.com/documentation/convert-old-shortcode/').attr('target', '_blank') ;
            $legacyDiv.append($legacySpan).append($div);
            $(this).replaceWith($legacyDiv);

            $legacyDiv.click(function() {
                let el = document.createElement('textarea');
                el.value = text;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                $div.css('display', 'none');
                $('.fts-legacy-code-instruction').hide();
                $legacyDiv.append($successSpan).append($link).append($successSpan2).append($link2);
            });
        });

        if (!body.hasClass('logged-in')) {
            $('.fts-legacy-shortcode-wrap').css('display', 'none');
        }
    }

    jQuery("#fts-clear-cache").on('click', function () {
        console.log('Settings Click Clear Cache Function');
        jQuery('.fts-cache-messages').addClass( 'fts-cache-loading' ).css('display', 'inline-block' ).html( 'Please Wait... Clearing Cache' );

        jQuery.ajax({
            data: {
                action: "fts_clear_cache_ajax",
                _wpnonce: ftsAjax.clearCacheNonce
            },
            type: 'POST',
            url: ftsAjax.ajaxurl,
            success: function (response) {
                console.log('Well Done and got this from sever: ' + response);
                jQuery('.fts-cache-messages').removeClass( 'fts-cache-loading' ).html( 'Success: Cache Cleared' );
                return false;
            }
        });
        return false;

    }); // end of form.submit
});