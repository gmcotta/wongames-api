import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

import Logo from '../../../assets/images/logo-won-white.svg';

const Wrapper = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.main.colors.won.blue};
    height: ${theme.main.sizes.leftMenu.height};
    .leftMenuHeaderLink {
      &:hover {
        text-decoration: none;
      }
    }
    .projectName {
      display: block;
      width: 100%;
      height: ${theme.main.sizes.leftMenu.height};
      font-size: 2rem;
      letter-spacing: 0.2rem;
      color: $white;
      background-image: url(${Logo});
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 12rem;
    }

  `}
`;

Wrapper.defaultProps = {
  theme: {
    main: {
      colors: {
        leftMenu: {},
      },
      sizes: {
        header: {},
        leftMenu: {},
      },
    },
  },
};

Wrapper.propTypes = {
  theme: PropTypes.object,
};

export default Wrapper;
