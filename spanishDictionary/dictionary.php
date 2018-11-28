<?php
  require "header.php";
?>

<main>
  <!-- Test Modal -->
      <div class="modal fade" id="addTermModal" tabindex="-1" role="dialog" aria-labelledby="modalTitleLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Add Term to Dictionary</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <form id="add-term-form" action="./services/dictionaryService.php?dictionary=1" method="post" enctype="multipart/form-data">
                  <div class="modal-body">
                      <div class="form-group">
                        <input type="text" class="form-control" name="entryText" placeholder="Term" required>
                        <br>
                        <input type="text" class="form-control" name="entryDefinition" placeholder="Definition" required>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="submit" class="btn btn-primary" name="newEntry" value="submit word to dictionary">Add Term</button>
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
                  </form>
              </div>
          </div>
      </div>
  <!-- Test Modal End -->

  <div class="container content-frame border rounded">
      <br>
      <div class="row align-items-start">
        <h1 class="col">Dictionary:
          <?php
          print_r($_GET["dictionaryID"]);
          ?>
        </h1>
        <button class="btn dark col-sm-auto" type="button" name="button" data-toggle="modal" data-target="#addTermModal"><i class="fas fa-plus"></i> Add Term</button>
      </div>
      <hr class="hr-header">
      <table id="table-dictionary" class="table table-hover" style="width:100%">
        <thead>
          <tr>
            <th></th>
            <th>Term</th>
            <th>Definition</th>
          </tr>
        </thead>
      </table>
      <br>
  </div>
</main>

<?php
  require "footer.php";
?>