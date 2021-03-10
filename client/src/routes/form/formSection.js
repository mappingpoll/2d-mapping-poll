import FormSectionKnobs from "./formSectionKnobs";
import EmptyGraph from "./emptyGraph";
import GraphInputLayer from "./graphInputLayer";
// import GraphInputDisplay from "./graphInputDisplay";
import CanvasGraphInputDisplay from "./canvasInputDisplay";

export default function FormSection(props) {
  return (
    <>
      <p>{props.description}</p>
      <EmptyGraph
        labels={props.labels}
        style="margin-bottom: 4em;"
        fuckoff={props.values.fuckoff}
      />
      <GraphInputLayer
        points={props.values.points}
        size={props.values.confidence}
        dispatch={props.dispatch}
      />
      <FormSectionKnobs dispatch={props.dispatch} values={props.values} />
      {/* <GraphInputDisplay
        points={props.values.points}
        size={props.values.confidence}
      /> */}
      <CanvasGraphInputDisplay
        points={props.values.points}
        size={props.values.confidence}
      />
    </>
  );
}
