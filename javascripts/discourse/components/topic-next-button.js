import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  nextTopicUrl,
  previousTopicUrl,
} from "discourse/lib/topic-list-tracker";
import DiscourseURL from "discourse/lib/url";
import { inject as service } from "@ember/service";

export default class TopicNextButton extends Component {
  @service site;
  @tracked label = "";
  @tracked showButton = false;
  @tracked nextURL = "";

  constructor(owner, args) {
    super(owner, args);
    nextTopicUrl().then((url) => {
      if (url) {
        this.showButton = true;
        this.nextURL = url;
      } else {
        this.showButton = false;
        this.nextURL = "";
      }
    })
  };

  get goFirst() {
    return settings.topic_next_always_go_to_first_post
  }

  @action
  goToNextTopic() {
    let url;
    if (this.nextURL) {
      url = this.goFirst
        ? this.nextURL.substring(0, this.nextURL.lastIndexOf("/"))
        : this.nextURL;
      DiscourseURL.routeTo(url);
    }
  };
}
