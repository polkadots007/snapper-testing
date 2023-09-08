/* eslint-disable no-undef */
describe('Not Found', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit(`${Cypress.config().baseUrl}/p/raphaeloo`);
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
  it('shows not found page', () => {
    cy.get('button[title="Log In"]').should('be.visible');
    cy.get('button[title="Sign Up"]').should('be.visible');
    cy.get('div').should('contain.text', 'Not Found!');
  });
});
