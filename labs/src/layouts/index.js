import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'react-emotion';
import Link from 'gatsby-link';
import 'typeface-roboto';
import SlideshowIcon from 'react-icons/lib/md/slideshow';

import { Header, Footer } from '@objectpartners/components';

import 'normalize.css';

import { LabsPicker } from '../components';

const HEADER_HEIGHT = 102;
const FOOTER_HEIGHT = 148;

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const SidebarContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Roboto, sans-serif',
  minHeight: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`, // oh the humanity
  '@media only screen and (min-width: 768px)': {
    flexDirection: 'row',
  },
});

const Content = styled.div({
  display: 'flex',
  alignSelf: 'flex-start',
  boxSixing: 'border-box',
  margin: 'auto',
  padding: '1rem',
  height: '100%',
  position: 'relative',
  '@media only screen and (min-width: 768px)': {
    width: '65%',
    maxWidth: 'calc(100% - 250px)',
  },
});

const SlideIcon = styled(SlideshowIcon)({
  color: 'rgba(255, 255, 255, 0.8)',
  transition: '175ms ease-in-out',
  ':hover': {
    color: 'white',
  },
});

export default function Layout({ children, data }) {
  return (
    <Container>
      <Helmet
        title={data.site.siteMetadata.title}
        meta={[
          { name: 'description', content: 'Sample' },
          { name: 'keywords', content: 'sample, something' },
        ]}
      />
      <Header
        renderLogo={({ Logo }) => (
          <React.Fragment>
            <Link to="/">
              <Logo theme="light" style={{ height: 30 }} />
            </Link>
            <a
              css={{ color: 'inherit', textDecoration: 'none' }}
              href="/slidedeck"
            >
              <SlideIcon size={30} />
            </a>
          </React.Fragment>
        )}
        githubLink="https://github.com/objectpartners/react-redux-workshop"
        title="React Training"
      />
      <SidebarContainer>
        <LabsPicker labs={data.labs.edges} />
        <Content>{children()}</Content>
      </SidebarContainer>
      <Footer />
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.func,
};

export const query = graphql`
  query SiteTitleQuery {
    labs: allMarkdownRemark(
      filter: { fields: { type: { eq: "lab" } } }
      sort: { fields: [fileAbsolutePath], order: ASC }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }

    site {
      siteMetadata {
        title
      }
    }
  }
`;
