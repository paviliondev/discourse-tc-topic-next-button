import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";
import {
  nextTopicUrl,
  previousTopicUrl,
} from "discourse/lib/topic-list-tracker";
import DiscourseURL from "discourse/lib/url";

export default {
  name: "topic-next-button-edits",

  initialize(container) {
    withPluginApi("0.8.32", function (api) {
      api.reopenWidget("timeline-controls", {
        buildKey: (attrs) => `timeline-controls-${attrs.id}`,

        defaultState() {
          return { loading: false, loaded: false, targetUrl: null };
        },

        getNextTopic(state) {
          if (state.loading) {
            return;
          }

          state.loading = true;

          nextTopicUrl().then((url) => {
            if (url && url.length) {
              state.targetUrl = url;
            } else {
              state.targetUrl = "";
            }
            state.loading = false;
            state.loaded = true;
            this.scheduleRerender();
          });
        },

        html(attrs, state) {
          if (!state.loaded) {
            this.getNextTopic(state);
          }

          const controls = this._super(attrs) || [];
          const { currentUser, topic } = attrs;

          if (
            state.loaded &&
            state.targetUrl &&
            (settings.topic_next_categories === "" ||
              settings.topic_next_categories
                .split("|")
                .includes(`${topic.category_id}`))
          ) {
            if (currentUser) {
              currentUser.admin
                ? controls.push(
                    h("br"),
                    h("span.topic-next-button-gap"),
                    h("br")
                  )
                : false;
              controls.push(
                h(
                  "span.topic-next-button",
                  this.attach("button", {
                    className: "topic-next-button",
                    buttonClass: "popup-menu-btn",
                    action: "goToNextTopic",
                    icon: "chevron-right",
                    label: themePrefix("topic_next_label"),
                  })
                )
              );
            }
          }
          return controls;
        },

        goToNextTopic() {
          nextTopicUrl().then((url) => {
            if (url) {
              url = settings.topic_next_always_go_to_first_post
                ? url.substring(0, url.lastIndexOf("/"))
                : url;
              DiscourseURL.routeTo(url);
            }
          });
        },
      });
    });
  },
};
