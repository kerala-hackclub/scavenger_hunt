import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Maze: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    switch (step) {
      case "begin":
        navigate("/maze/step1");
        break;
      case "step3":
        navigate("/maze/step5");
        break;
      default:
        break;
    }
  }, [step, navigate]);

  const renderContent = () => {
    switch (step) {
      case "step1":
        return <p>Clue: add 2</p>;
      case "step5":
        return <p>Clue: multiply by 3</p>;
      case "step15":
        return <p>{"FLAG{redirect_expert}"}</p>;
      default:
        return <p>Welcome to the maze!</p>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default Maze;
