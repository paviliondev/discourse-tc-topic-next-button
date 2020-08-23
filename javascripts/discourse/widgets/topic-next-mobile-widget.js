import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import {
  nextTopicUrl,
  previousTopicUrl,
} from "discourse/lib/topic-list-tracker";
import DiscourseURL from "discourse/lib/url";

createWidget("topic-next-button-mobile-widget", {
  tagName: "span.topic-next-button-mobile-widget",

  buildKey: () => `topic-next-button-mobile-widget`,

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

    const category_id = attrs.model.category_id;
    var controls = [];

    if (
      this.currentUser &&
      this.site.mobileView &&
      state.loaded &&
      state.targetUrl &&
      (settings.topic_next_categories === "" ||
        settings.topic_next_categories.split("|").includes(`${category_id}`))
    ) {
      controls.push(
        h(
          "span.topic-next-button-mobile",
          this.attach("button", {
            className: "topic-next-button-mobile",
            buttonClass: "popup-menu-btn",
            action: "goToNextTopic",
            icon: "chevron-right",
          })
        )
      );
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
