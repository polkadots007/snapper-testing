/* eslint-disable no-undef */
describe('Dashboard', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit(`${Cypress.config().baseUrl}/login`);
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
    cy.get('div')
      .find('img')
      .should('be.visible')
      .should('have.attr', 'alt')
      .should('contain', 'Instagram');
  });
  it('logs the user in, renders the dashboard and does the minimum UI checks', () => {
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', 'priyansi'); // username
      cy.get('div').should('contain.text', 'Priyansi Parida'); // full name
      cy.get('div').should('contain.text', 'Suggestions for you'); // full name
      cy.get('[alt="priyansi"]').should('be.visible');
    });
  });
  it('logs the user in and adds a comment to the photo', () => {
    cy.get('[data-testid="add-comment-VO7CTMF4AJ1qszyyBZFa"]')
      .should('have.attr', 'placeholder', 'Add a comment...')
      .type('Great view');
    cy.get('[data-testid="add-comment-submit-VO7CTMF4AJ1qszyyBZFa"]').submit();
  });
  it('logs the user in and likes the photo', () => {
    cy.get('[data-testid="like-photo-VO7CTMF4AJ1qszyyBZFa"]').click();
  });
  it('logs the user in and signs out', () => {
    cy.get('[data-testid="sign-out"]').click();
  });
});
