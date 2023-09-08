/* eslint-disable no-undef */
describe('Profile', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit(`${Cypress.config().baseUrl}/p/raphael`);
    //   cy.get('body').within(() => {
    //     cy.get('div').should('contain.text', "Don't have an account? Sign up");
    //   });
    //   cy.get('div')
    //     .find('img')
    //     .should('be.visible')
    //     .should('have.attr', 'alt')
    //     .should('contain', 'iPhone with Instagram on it');
    //   cy.get('form').within(() => {
    //     cy.get('input:first')
    //       .should('have.attr', 'placeholder', 'Email address')
    //       .type('priyansiparida07@gmail.com');

    //     cy.get('input:last').should('have.attr', 'placeholder', 'Password').type('chanyeolo614P@');
    //     cy.get('button').should('contain.text', 'Log In').click();
    //   });
    cy.get('div')
      .find('img')
      .should('be.visible')
      .should('have.attr', 'alt')
      .should('contain', 'Instagram');
  });
  it('shows not logged in user the profile and stats', () => {
    cy.get('button[title="Log In"]').should('be.visible');
    cy.get('button[title="Sign Up"]').should('be.visible');
    cy.get('div').should('contain.text', 'raphael');
    cy.get('div').should('contain.text', 'Raffaello Sanzio da Urbino');
    cy.get('div').should('contain.text', '5 Photos');
    cy.get('div').should('contain.text', '1 Follower');
    cy.get('div').should('contain.text', '0 Following');
  });
  it('logged in user, navigates to user profile page from dashboard and follow actions', () => {
    cy.get('button[title="Log In"]').click();
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', "Don't have an account? Sign up");
    });
    cy.get('div')
      .find('img')
      .should('be.visible')
      .should('have.attr', 'alt')
      .should('contain', 'iPhone with Instagram on it');
    cy.get('form').within(() => {
      cy.get('input:first')
        .should('have.attr', 'placeholder', 'Email address')
        .type('priyansiparida07@gmail.com');

      cy.get('input:last').should('have.attr', 'placeholder', 'Password').type('chanyeolo614P@');
      cy.get('button').should('contain.text', 'Log In').click();
    });
    cy.get('div').should('contain.text', 'priyansi');
    cy.get('div').should('contain.text', 'Priyansi Parida'); // full name
    cy.get('div').should('contain.text', 'Suggestions for you'); // full name
    cy.get('[alt="priyansi"]').should('be.visible');

    cy.get('img[alt="raphael profile"]').first().click();
    cy.get('div').should('contain.text', 'raphael');
    cy.get('div').should('contain.text', 'Raffaello Sanzio da Urbino');
    cy.get('[data-testid="follow-status-btn"]')
      .should('be.visible')
      .should('contain.text', 'Unfollow');
    cy.get('[data-testid="follow-status-btn"]').click();
    cy.get('[data-testid="follow-status-btn"]')
      .should('be.visible')
      .should('contain.text', 'Follow');
    cy.get('div').should('contain.text', '0 Follower');
    cy.get('[data-testid="follow-status-btn"]').click();
    cy.get('[data-testid="follow-status-btn"]')
      .should('be.visible')
      .should('contain.text', 'Unfollow');
    cy.get('div').should('contain.text', '1 Follower');
  });
});
