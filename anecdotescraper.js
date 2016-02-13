var anecdotescraper = {
    db: {
        "title": "",
        "stories": [],
        "clear": function () {
            this.stories = [];
        }
    },

    story: {
        "id": 0,
        conversation: []
    },

    conversation: {
        "speaker": "",
        "text": ""
    },

    dev: false,

    "init": function () {
      console.log("init");
        // jQuery is not loaded
        var jq = document.createElement('script');
        jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
        document.getElementsByTagName('head')[0].appendChild(jq);

    },

    "wrapInDivs": function () {
      console.log("wrapInDivs");
        jQuery('.content hr').each(function (index, element) {
            jQuery(this).nextUntil('hr').wrapAll("<div id=\"anecdote" + index + "\" class=\"anecdote\"></div>");
        });
    },

    "processing": function () {

        /** Set noConflict with jQuery */
        jQuery.noConflict();

        /** Create textbox for output JSON */

        if (!this.dev) {
            jQuery('body').append('<div id="story-container" style="position:fixed;bottom:10px;right:10px;z-index:1000;">\n <button style="color: #fff; float: right !important;background-color: #d9534f;border-color: #d43f3a;" onClick="rfsbundlescraper.utils.resetAndClear();">Reset/Clear</button>\n <br />\n <div id="rfsbundlescraper-version" style="font-weight: bolder; position:fixed;bottom: 3px;z-index:1500;width: 422px;-webkit-user-select: none;right: 10px; background:black; color:white; text-align:center">\n </div><textarea onClick="this.select()" id="story-list" spellcheck="false" style="width: 415px; height: 208px !important; margin-bottom: 10px;"></textarea>\n</div>');
        }
        /** get the page title */
        anecdotescraper.db.title = jQuery('h3').text();

        var anecdoteID = 0;

        /** gather stories */
        jQuery('div.anecdote').each(function (index, element) {
            anecdoteID = element.id;
            anecdotescraper.story = {"id": 0, conversation: []};

            jQuery(this).children().each(function (index, element) {
                //console.log('child of div.anecdote ' + index + ', anecdoteID: ' + anecdoteID);
                if (element.tagName == 'UL') {
                    //console.log("anecdoteID: " + anecdoteID + ", tagName: " + element.tagName);
                    jQuery(this).each(function (index, element) {
                        //console.log("element: " + element.tagName);
                        jQuery(this).children('li').each(function (index, element) {
                            //console.log('inside UL.children(li): ' + index);
                            //console.log(element);
                            jQuery(this).children().each(function (index, element) {
                              //console.log('inside li children');
                              //console.log(index + ', anecdoteID: ' + anecdoteID);
                              //console.log(element);
                              //console.log("element.textContent: " + element.textContent);
                              //console.log("element.nextSibling.data: " + element.nextSibling.data);
                                if(element.tagName == 'SPAN') {
                                    anecdotescraper.conversation.speaker = element.textContent; // get span content
                                    if (element.nextSibling !== null)
                                        anecdotescraper.conversation.text = element.nextSibling.data; // get sibling(text) content
                                } else {
                                    //console.log("NOT SPAN");
                                    //console.log(element);
                                }

                              anecdotescraper.story.conversation.push(anecdotescraper.conversation);
                              anecdotescraper.conversation = {};
                            }); // END this.children().each

                        });// end this.children('li')
                    }); // end this.each
                } else if (element.tagName == 'P') { // end if tagname == ul
                    //console.log("anecdoteID: " + anecdoteID + ", tagName: " + element.tagName);
                    anecdotescraper.conversation.paragraph = element.textContent;

                    anecdotescraper.story.conversation.push(anecdotescraper.conversation);
                    if(element.nextSibling) {
                        //console.log("this");
                        //console.log(element);
                        if (element.nextSibling.tagName === 'UL') {
                            jQuery.each(element.nextSibling.children, function(e,v){
                                var conversation = {};
                                conversation.text = v.textContent;
                                anecdotescraper.story.conversation.push(conversation);
                            });
                        }
                    }
                    anecdotescraper.conversation = {};
                }
            }); // end this.children()
            anecdotescraper.story.id = anecdoteID;

            anecdotescraper.db.stories.push(anecdotescraper.story);
        }); // end div.anecdote

        /** Print everything to the textbox */
        if (!this.dev) {
            jQuery('#story-list').text(JSON.stringify(anecdotescraper.db, null, 2));
        }
    }
};

anecdotescraper.init();

setTimeout(function() {
    anecdotescraper.wrapInDivs();
    anecdotescraper.processing();
},2000);

