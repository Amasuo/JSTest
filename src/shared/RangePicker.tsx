import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 450,
  },
});

export default function DiscreteSlider() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Slider
        defaultValue={0}
        aria-labelledby="discrete-slider-small-steps"
        step={1}
        marks
        min={0}
        max={5}
        valueLabelDisplay="auto"
      />
    </div>
  );
}
