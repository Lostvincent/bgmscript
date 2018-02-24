// ==UserScript==
// @name         BGM NSFW
// @namespace    https://greasyfork.org/zh-CN/scripts/38829-bgm-nsfw
// @version      0.3
// @description  NSFW for bgm
// @author       Vincent
// @include      /^https?:\/\/((bangumi|bgm)\.tv|chii.in)\/group\/topic\/\d+$/
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.btn-nsfw {
    color: #AAAAAA;
    border-radius: 4px;
    padding: 0 4px;
    margin-left: 4px;
    cursor: pointer;
}
.btn-nsfw-cancel {
    color: #FFFFFF;
    background: #F09199;
    border-radius: 4px;
    padding: 0 4px;
    margin-left: 4px;
    cursor: pointer;
}
.post-nsfw {
    display: none !important;
}
`);

var nsfw_items = undefined;
var topic_id = null;

(function() {
    topic_id = window.location.pathname.split('/')[3];

    nsfw_items = window.localStorage['nsfw_topic_' + topic_id];
    if (nsfw_items) {
        nsfw_items = nsfw_items.split(',');
        item = $('#post_' + nsfw_items.join(', #post_'));
        addNSFW(item);

        item.children('div.re_info').append('<small class="btn-nsfw-cancel">NSFW</small>');
    }

    addNSFWBtn();
})();

function addNSFWBtn() {
    $('#comment_list').on('mouseenter', 'div[id*=post_]', function () {
        if (!$(this).children('div.re_info').children('small.btn-nsfw, small.btn-nsfw-cancel').length) {
            $(this).children('div.re_info').append('<small class="btn-nsfw">NSFW</small>');
        }
    });
    $('#comment_list').on('mouseleave', 'div[id*=post_]', function () {
        $(this).children('div.re_info').children('small.btn-nsfw').remove();
    });

    // temp action
    $('#comment_list').on('click', 'small.btn-nsfw', function () {
        var item = $(this).parent().parent();

        addNSFW(item);
        storeNSFWLocal(item.prop('id').split('_')[1]);

        $(this).addClass('btn-nsfw-cancel');
        $(this).removeClass('btn-nsfw');
    });
    $('#comment_list').on('click', 'small.btn-nsfw-cancel', function () {
        var item = $(this).parent().parent();

        removeNSFW(item);
        cancelNSFWLocal(item.prop('id').split('_')[1]);

        $(this).addClass('btn-nsfw');
        $(this).removeClass('btn-nsfw-cancel');
    });
}

function addNSFW(item) {
    item.not('.row_reply').addClass('sub_reply_collapse');
    item.children('div.inner').children('div.cmt_sub_content').addClass('post-nsfw');
    item.children('div.inner').children('div.reply_content').children('div.message').addClass('post-nsfw');
}

function removeNSFW(item) {
    item.filter('.sub_reply_collapse').removeClass('sub_reply_collapse');
    item.children('div.inner').children('div.cmt_sub_content').removeClass('post-nsfw');
    item.children('div.inner').children('div.reply_content').children('div.message').removeClass('post-nsfw');
}

function storeNSFWLocal(post_id) {
    if (nsfw_items == undefined || nsfw_items == '') {
        nsfw_items = [];
    }
    if (nsfw_items.indexOf(post_id) == - 1) {
        nsfw_items.push(post_id);
        window.localStorage['nsfw_topic_' + topic_id] = nsfw_items.join(',');
    }
}

function cancelNSFWLocal(post_id) {
    if (nsfw_items == undefined || nsfw_items == '') {
        nsfw_items = [];
    }
    if (nsfw_items.indexOf(post_id) != - 1) {
        nsfw_items.splice(nsfw_items.indexOf(post_id), 1);
        if (nsfw_items.length) {
            window.localStorage['nsfw_topic_' + topic_id] = nsfw_items.join(',');
        } else {
            window.localStorage.removeItem('nsfw_topic_' + topic_id);
        }
    }
}
