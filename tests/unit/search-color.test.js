const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const code = readFileSync(join(__dirname, '../../public/js/code.js'), 'utf8');

function searchWithResponse(response) {
  const elements = {
    searchText: { value: 'bl' },
    colorSearchResult: { textContent: '' },
    colorList: { textContent: 'Previous result' },
  };

  class FakeRequest {
    open() {}
    setRequestHeader() {}

    send() {
      this.readyState = 4;
      this.status = 200;
      this.responseText = JSON.stringify(response);
      this.onreadystatechange();
    }
  }

  const browser = {
    document: { getElementById: (id) => elements[id] },
    XMLHttpRequest: FakeRequest,
  };

  runInNewContext(code, browser);
  browser.searchColor();
  return elements;
}

test('formats matching colors with one name per line', () => {
  const { colorList, colorSearchResult } = searchWithResponse({
    results: ['Sky Blue', 'Slate Blue'],
    error: '',
  });

  expect(colorList.textContent).toBe('Sky Blue\nSlate Blue');
  expect(colorSearchResult.textContent).toBe('Color(s) has been retrieved');
});

test('clears previous results and shows the message when no colors match', () => {
  const { colorList, colorSearchResult } = searchWithResponse({
    results: [],
    error: 'No Records Found',
  });

  expect(colorList.textContent).toBe('');
  expect(colorSearchResult.textContent).toBe('No Records Found');
});
