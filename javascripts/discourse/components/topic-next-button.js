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

  @action
  goToNextTopic() {
    console.log('hellooooo');
    console.log(this.site.desktopView);
    nextTopicUrl().then((url) => {
      if (url) {
        url = settings.topic_next_always_go_to_first_post
          ? url.substring(0, url.lastIndexOf("/"))
          : url;
        DiscourseURL.routeTo(url);
      }
    });
  };
}
