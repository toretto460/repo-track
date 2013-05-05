
$(document).ready(function(){

    $('#modal-from-dom').bind('show', function() {
        var id = $(this).data('id'),
            removeBtn = $(this).find('.danger'),
            href = removeBtn.attr('href');

        removeBtn.attr('href', href.replace(/&ref=\d*/, '&ref=' + id));
    })
        .modal({ backdrop: true });

    $('.confirm-delete').click(function(e) {
        e.preventDefault();

        var id = $(this).data('id');
        $('#modal-from-dom').data('id', id).modal('show');
    });

  $.ajax({
    url: "/private/repos",
    success: function (dataRepos, status, jqXHR) {

      var createRepoElement = function(repo, callback){
        repoLi = document.createElement('tr');
        reponame = document.createElement('td');
        reponame.className = 'element  with-pointer';
        $(reponame).text(repo.name);
        repoLi.appendChild(reponame);
        repoLi.style = "display: none;";
        repoLi.className = "repo";
        repoLi.setAttribute('data-name', repo.name);
        repoLi.setAttribute('data-repo', repo.id);

        $('#repo-list').append(repoLi);
        callback(repoLi, repo);

      };

      $.each(dataRepos, function(){
        var el = this;
        var tagIcon = document.createElement('i');

        tagIcon.className = 'icon-2x icon-tag with-pointer-help';
        createRepoElement(el, function(repoLi, repo){

            var getCounterSnippet = document.createElement('td');
            getCounterSnippet.setAttribute('data-toggle', 'modal');
            getCounterSnippet.setAttribute('data-target', '#modal-repo');
            getCounterSnippet.setAttribute('data-repo', repo.id);
            $(getCounterSnippet).append(tagIcon);
            $(getCounterSnippet).click(function(){
                snippet = 'Please create a counter for this repo';
                if(el.snippet){
                    snippet = el.snippet;
                }
                $('#snippet').text(snippet);

            });
            var counter = document.createElement('td');
            counter.className = "counter";
            counter.setAttribute('data-repo', repo.id);
            var counterValue = document.createElement('span');
            $(counter).append(counterValue);
            $.ajax({
                url: '/' + repo.id + '/raw',
                success: function(data, textStatus, jqHR){
                    if(textStatus === 'success') {
                        counterValue.innerText = '('+ data.value + ')';
                        el.snippet = data.snippet;
                    }
                },
                statusCode:{
                    404: function(){
                        //repo has not a counter
                    }
                }
            });

            $(repoLi).append(getCounterSnippet);
            $(repoLi).append(counter);
            $(repoLi).fadeIn('slow');
            $(getCounterSnippet).click(function(){

            });
      });

      $('.bubblingG').hide();

      });

      $('.element').click(function(){
        $('#modal-counter-create').modal('show');
        $('#modal-counter-create').attr('data-repo', $(this).parent().attr('data-repo'));
      });

      $('#modal-counter-submit').click(function(){
          $.ajax({
              type: 'post',
              url:  '/register',
              data:  {repo_name: $('#modal-counter-create').attr('data-repo')},
              success: function(data, textSuccess, jqXHR){
                  alert('Created!');
                  setTimeout(function(){
                      $('#modal-counter-create').modal('hide');
                  }, 300);
              },
              statusCode:{
                  409: function(data, textSuccess, jqXHR){
                      alert('This counter was already present!!');
                  }
              }
          });
      });

      $('#modal-counter-discard').click(function(){
          $('#modal-counter-create').modal('hide');
      });
    }
  });
});