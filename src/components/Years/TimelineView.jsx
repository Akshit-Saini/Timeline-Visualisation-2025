// TimelineView.jsx
import React from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/style.css";
import moment from "moment";

const TimelineView = ({ results }) => {
  // We create one group for simplicity.
  const groups = [{ id: 1, title: "People" }];
  const items = results.map((item, index) => ({
    id: index,
    group: 1,
    title: item.name,
    start_time: moment(item.birth, "YYYY-MM-DD"),
    end_time: moment(item.death, "YYYY-MM-DD"),
    itemProps: { style: { background: "#D1C72E", color: "white" } },
  }));

  return (
    <div>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().subtract(500, "year")}
        defaultTimeEnd={moment().add(500, "year")}
      />
    </div>
  );
};

export default TimelineView;