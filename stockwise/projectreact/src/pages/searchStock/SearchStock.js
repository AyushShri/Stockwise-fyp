import React, { useEffect, useState } from "react";
import {
  Grid,
} from "@material-ui/core";


// styles
import useStyles from "../dashboard/styles";

import { Typography } from "../../components/Wrappers";
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function SearchStock(props) {
  var classes = useStyles();
  const state = useSelector(reducer => reducer.dashboardReducer);
  const { stockData } = state;
  const history = useHistory();

  
  return (
    <>
      <Grid container spacing={3}>
        {
          stockData?.map((item, index) => (
            <Grid item xs={4} key={index.toString()} onClick={() => history.push({
              pathname: "/app/stock-details",
              state: {
                stockData: item
              }
            })}>
              <div className={classes.cardContainer}>
                <Typography variant="body1" color="text" className={classes.nameText} noWrap>
                  {item['2. name']}{`(${item['1. symbol']})`}
                </Typography>
                <Typography color="text" colorBrightness="secondary">
                  {item['4. region']}{`(${item['8. currency']})`}
                </Typography>
                <Typography color="text" colorBrightness="secondary">
                  {item['3. type']}
                </Typography>
                <div className={classes.bottomContainer}>
                  <Typography
                    color="text"
                    colorBrightness="secondary"
                    className={classes.serverOverviewElementText}
                    noWrap
                  >
                    {`Time: ${item['5. marketOpen']} to ${item['6. marketClose']}`}
                  </Typography>
                  <Typography
                    color="text"
                    colorBrightness="secondary"
                    className={classes.serverOverviewElementText}
                    noWrap
                  >
                    {`Score: ${item['9. matchScore']}`}
                  </Typography>
                </div>
              </div>
            </Grid>
          ))
        }
      </Grid>
    </>
  );
}

