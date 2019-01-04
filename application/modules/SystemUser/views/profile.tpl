<div class="row">

    <!-- col -->
    <div class="col-xs-12 col-sm-7 col-md-7 col-lg-4">
        <h1 class="page-title txt-color-blueDark">
            <i class="fa-fw fa fa-puzzle-piece"></i> App Views <span>>
							Profile </span></h1>
    </div>
    <!-- end col -->

    <!-- right side of the page with the sparkline graphs -->
    <!-- col -->
    <div class="col-xs-12 col-sm-5 col-md-5 col-lg-8">
    </div>
    <!-- end col -->

</div>


<!-- row -->



<div class="row" style="margin-top: 15px;">

    <div class="col-sm-12 col-md-12 col-lg-6">

        <div class="well well-light well-sm no-margin no-padding">

            <div class="row">

                <div class="col-sm-12">

                    <div class="row">

                        <div class="col-sm-3 profile-pic">
                            {img src=$user.avatar alt="{$user.fullname}"}

                        </div>
                        <div class="col-sm-9">
                            <h1>
                                <span class="semi-bold">{$user.fullname}</span>
                                <br>
                                <small>{$user.username}</small>
                            </h1>

                            <ul class="list-unstyled">
                                {if isset($user.phone) && $user.phone|@count > 0}
                                    <li>
                                        <p class="text-muted">
                                            <i class="fa fa-phone"></i>&nbsp;&nbsp;<span class="txt-color-darken">{$user.phone}</span>
                                        </p>
                                    </li>
                                {/if}
                                <li>
                                    <p class="text-muted">
                                        <i class="fa fa-envelope"></i>&nbsp;&nbsp;<a href="mailto:{$user.email}">{$user.email}</a>
                                    </p>
                                </li>
                                {if isset($user.skype) && $user.skype|@count > 0}
                                    <li>
                                        <p class="text-muted">
                                            <i class="fa fa-skype"></i>&nbsp;&nbsp;<span class="txt-color-darken">{$user.skype}</span>
                                        </p>
                                    </li>
                                {/if}

                            </ul>

                            <br>

                        </div>


                    </div>

                </div>

            </div>

        </div>


    </div>
    <div class="col-sm-12 col-md-12 col-lg-6">
        <div class="well padding-10">
            <h5 class="margin-top-0"><i class="fa fa-thumbs-o-up"></i> {lang txt="monthly end balance"}</h5>
            <div class="row">

                <div class="col-lg-12">

                    <ul class="list-group no-margin">
                        <li class="list-group-item">
                            {lang txt="end balance"}
                            <span class="badge pull-right">15</span>
                        </li>
                        <li class="list-group-item">
                            {lang txt="interest"}
                            <span class="badge pull-right">30</span>
                        </li>
                    </ul>

                </div>
            </div>
        </div>
    </div>
</div>

