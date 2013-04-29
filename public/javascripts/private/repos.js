
$(document).ready(function(){
      $.ajax({
        url: "/private/repos",
        success: function (data, status, jqXHR) {

          var createRepoElement = function(repo, callback){
          	repoLi = document.createElement('li');
          	repoLi.appendChild(document.createTextNode(repo.name));
          	repoLi.style = "display: none;";
            repoLi.class = "repo";
            repoLi.setAttribute('data-name', repo.name);

          	$('#repo-list').append(repoLi);
            callback(repoLi);
            setTimeout(function(){
              $('#' + repo.id).fadeIn('slow');  
            },10);
          };

          $.each(data, function(){
          	createRepoElement(this, function(repo){
              
            });

          });

          $('#repo-list li').click(function(){

            $.post('register', {repo_name: this.getAttribute('data-name')}, function(data){
              console.log(data);
            });
              
          });
        }
      });
    });