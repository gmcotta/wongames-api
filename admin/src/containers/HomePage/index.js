/* eslint-disable */
import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { LoadingIndicatorPage } from 'strapi-helper-plugin';
import { useModels } from '../../hooks';

import { ALink, Block, Container, LinkWrapper, P, Separator } from './components';
import SocialLink from './SocialLink';

const FIRST_BLOCK_LINKS = [
  {
    link:
      'https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html#_4-create-a-category-content-type',
    contentId: 'app.components.BlockLink.documentation.content',
    titleId: 'app.components.BlockLink.documentation',
  },
  {
    link: 'https://github.com/strapi/foodadvisor',
    contentId: 'app.components.BlockLink.code.content',
    titleId: 'app.components.BlockLink.code',
  },
];

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    link: 'https://github.com/React-avancado/',
  },
  {
    name: 'Slack',
    link: 'https://willianjusten-cursos.slack.com/ssb/redirect#/',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/Willian_Justen',
  }
];

const HomePage = () => {
  const { isLoading: isLoadingForModels } = useModels();

  if (isLoadingForModels) {
    return <LoadingIndicatorPage />;
  }

  return (
    <>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <Block>
              <h2 id="mainHeader">Bem-vindo ao Won Games!</h2>
              <P>
                Ao lado esquerdo você pode inserir diversos jogos,
                desenvolvedores, categorias e publisher para a nossa maravilhosa
                loja de jogos
              </P>
              <Separator style={{ marginTop: 37, marginBottom: 36 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {FIRST_BLOCK_LINKS.map((data, index) => {
                  const type = index === 0 ? 'doc' : 'code';

                  return (
                    <LinkWrapper href={data.link} target="_blank" key={data.link} type={type}>
                      <FormattedMessage id={data.titleId}>
                        {title => <p className="bold">{title}</p>}
                      </FormattedMessage>
                      <FormattedMessage id={data.contentId}>
                        {content => <p>{content}</p>}
                      </FormattedMessage>
                    </LinkWrapper>
                  );
                })}
              </div>
            </Block>
          </div>

          <div className="col-md-12 col-lg-4">
            <Block style={{ paddingRight: 30, paddingBottom: 0 }}>
              <h2>Veja nossas mídias sociais!</h2>
              <P style={{ marginTop: 7, marginBottom: 0 }}>
                Em caso de dúvidas e/ou sugestões, só ir em algum de nossos links.
              </P>
              <FormattedMessage id="HomePage.roadmap">
                {msg => (
                  <ALink
                    rel="noopener noreferrer"
                    href="https://reactavancado.com.br"
                    target="_blank"
                  >
                    Veja o planejamento de módulos
                  </ALink>
                )}
              </FormattedMessage>

              <Separator style={{ marginTop: 18 }} />
              <div
                className="row social-wrapper"
                style={{
                  display: 'flex',
                  margin: 0,
                  marginTop: 36,
                  marginLeft: -15,
                }}
              >
                {SOCIAL_LINKS.map((value, key) => (
                  <SocialLink key={key} {...value} />
                ))}
              </div>
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
