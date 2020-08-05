import {withPluginApi} from 'discourse/lib/plugin-api';
import {h} from 'virtual-dom';
import {nextTopicUrl, previousTopicUrl} from 'discourse/lib/topic-list-tracker';

export default {
  name: 'topic-next-button-edits',

  initialize (container) {
    withPluginApi ('0.8.32', function (api) {
      api.reopenWidget ('timeline-controls', {
        html (attrs) {
          const controls = this._super (attrs) || [];
          const {fullScreen, currentUser, topic} = attrs;
          if (currentUser) {
            currentUser.admin ? controls.push (h ('br')) : false;
            controls.push (
              h (
                'span.topic-next-button',
                this.attach ('button', {
                  className: 'topic-next-button',
                  buttonClass: 'popup-menu-btn',
                  action: 'goToNextTopic',
                  icon: 'chevron-right',
                  label: themePrefix ('topic_next_label'),
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
        },
      });
    });
  },
};
