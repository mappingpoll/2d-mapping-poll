import FormSectionKnobs from "./formSectionKnobs";
import EmptyGraph from "./emptyGraph";
import GraphInputLayer from "./graphInputLayer";
// import GraphInputDisplay from "./graphInputDisplay";
import GraphInputDisplay from "./graphInputDisplay";
import DraggableDot from "./draggableDot";
import { size2Radius } from "./misc";

export default function FormSection(props) {
  return (
    <>
      <p>{props.description}</p>
      <EmptyGraph
        labels={props.labels}
        style="margin-bottom: 4em;"
        fuckoff={props.values.fuckoff}
      />
      <GraphInputLayer dispatch={props.dispatch} />
      {props.values.points.map((point, idx) => (
        <DraggableDot
          key={`point${idx}`}
          id={idx}
          pos={point}
          radius={size2Radius(props.values.confidence)}
          dispatch={props.dispatch}
        />
      ))}
      <FormSectionKnobs dispatch={props.dispatch} values={props.values} />
      <GraphInputDisplay
        points={props.values.points}
        size={props.values.confidence}
      />
    </>
  );
}
