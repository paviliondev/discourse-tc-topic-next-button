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
    return { urlChecked: false, targetUrl: null };
  },

  html(attrs) {
    let _this = this;

    if (!this.state.urlChecked) {
      nextTopicUrl().then((url) => {
        _this.state.urlChecked = true;
        _this.state.targetUrl = url;
        _this.scheduleRerender();
      });
    }

    const category_id = attrs.model.category_id
    var controls = [];

    if (
      this.currentUser &&
      this.site.mobileView &&
      _this.state.urlChecked &&
      _this.state.targetUrl &&
      (settings.topic_next_categories === "" ||
        settings.topic_next_categories
          .split("|")
          .includes(`${category_id}`))
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
