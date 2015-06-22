

var res = html.getPageDetails('https://github.com/kilimchoi/engineering-blogs');

//print(res);

var pageDetails = JSON.parse(res);

print('title: ' + pageDetails.title);

print('text: ' + pageDetails.text);

pageDetails.links.forEach(function(link){
    print('link text: ' + link.text);
    print('link url: ' + link.url);
});