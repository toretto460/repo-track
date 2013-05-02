
$(document).ready(function(){
      $.ajax({
        url: "/private/repos",
        success: function (data, status, jqXHR) {

          var createRepoElement = function(repo, callback){
          	repoLi = document.createElement('li');
          	repoLi.appendChild(document.createTextNode(repo.name));
          	repoLi.style = "display: none;";
            repoLi.className = "repo";
            repoLi.setAttribute('data-name', repo.name);
            repoLi.setAttribute('data-repo', repo.id);

          	$('#repo-list').append(repoLi);
            callback(repoLi, repo);

          };

          $.each(data, function(){
          	createRepoElement(this, function(repoLi, repo){
                var getCounterSnippet = document.createElement('span');
                getCounterSnippet.innerText = "get Snippet";
                getCounterSnippet.className = "get-snippet to-right";
                getCounterSnippet.setAttribute('data-repo', repo.id);
                $(getCounterSnippet).click(function(el){
                    alert('clicked get snippet for repo ' + repo.id);
                });
                var counter = document.createElement('span');
                counter.className = "counter";
                counter.setAttribute('data-repo', repo.id);
                $.get('/counter/' + repo.id, function(data){
                    counter.innerText = data.conter;
                });

                $(repoLi).append(getCounterSnippet);
                $(repoLi).fadeIn('slow');
              
            });

          $('.bubblingG').hide();

          });
//
//          $('#repo-list li').click(function(){
//
//            $.post('register', {repo_name: this.getAttribute('data-name')}, function(data){
//              console.log(data);
//            });
//
//          });
        }
      });
    });