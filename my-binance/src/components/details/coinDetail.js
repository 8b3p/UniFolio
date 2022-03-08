import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CoinDetail = props => {
  return (
    <React.Fragment>
      <hr style={{width: '90%'}} className="mx-auto my-2" />
      <span className="col-4 my-2 text-center">{`${props.obj['coinName']}`}</span>
      <span className="col-4 my-2 text-center">{`${parseFloat(props.obj['coinPrice']).toFixed(2)}$`}</span>
      <span className="col-4 my-2 text-center">{`${(props.obj['coinBalance']).toFixed(2)}$`}</span>
    </React.Fragment>
  );
};

export default CoinDetail;