import tzs from "./ne_10m_time_zones.json";
import { featureReduce } from "@turf/turf";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=86400");

  const outputTzs = featureReduce(
    tzs,
    (acc, cur) => {
      acc[cur.properties.tz_name1st] = {
        tz: cur.properties.tz_name1st,
        offset: cur.properties.utc_format,
        zone: cur.properties.zone,
      };
      return acc;
    },
    {},
  );

  res.status(200).json(outputTzs);
}
