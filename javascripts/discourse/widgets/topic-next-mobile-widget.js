import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import {nextTopicUrl, previousTopicUrl} from 'discourse/lib/topic-list-tracker';

createWidget('topic-next-button-mobile-widget', {
  tagName: 'span.topic-next-button-mobile-widget',

  html(attrs) {
    const {fullScreen, currentUser, topic} = attrs;
    var controls = [];
    if (this.currentUser && this.site.mobileView) {
      controls.push (
        h (
          'span.topic-next-button-mobile',
          this.attach ('button', {
            className: 'topic-next-button-mobile',
            buttonClass: 'popup-menu-btn',
            action: 'goToNextTopic',
            icon: 'chevron-right',
          })
        )
      );
    }

    return controls;
  },

  goToNextTopic () {
    console.log('here');
    nextTopicUrl ().then (url => {
      if (url) {
        url = settings.topic_next_always_go_to_first_post ? url.substring(0, url.lastIndexOf('/')) : url;
        DiscourseURL.routeTo (url);
      }
    });
  }
});