import React from 'react';
import { PropTypes } from 'prop-types';
import Wrapper, { A } from './Wrapper';

function LeftMenuFooter() {
  return (
    <Wrapper>
      <div className="poweredBy">
        <A key="website" href="https://reactavancado.com.br" target="_blank" rel="noopener noreferrer">
          React Avançado
        </A>
      </div>
    </Wrapper>
  );
}

LeftMenuFooter.propTypes = {
  version: PropTypes.string.isRequired,
};

export default LeftMenuFooter;
