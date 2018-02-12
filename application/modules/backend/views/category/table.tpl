<div class="widget-body no-padding">
    <table class="table table-striped table-bordered table-hover" width="100%">
        <thead>
        <tr>
            <th style="width: 5%" class="text-center">
                <i class="fa fa-fw fa-key text-muted hidden-sm hidden-xs"></i>
                ID
            </th>
            <th>
                <i class="fa fa-fw fa-user text-muted hidden-sm hidden-xs"></i>
                {lang text='name'}
            </th>
            <th style="width: 10%" class="text-center">
                <i class="fa fa-fw fa-calendar txt-color-blue hidden-sm hidden-xs"></i>
                Edit
            </th>
        </tr>
        </thead>
        <tbody>
        {if isset($categories)}
            {assign var=cate1 value=0}
            {foreach $categories AS $cate}
                {$cate1 = $cate1 +1}
                <tr>
                    <td class="text-center" >{$cate1}</td>
                    <td>{$cate.name}</td>
                    <td class="text-center" >
                        <a href="javascript:void(0);" class="btn btn-info btn-xs">
                            <i class="fa fa-pencil"></i>
                        </a>
                        <a href="javascript:void(0);" class="btn btn-info btn-xs">
                            <i class="fa fa-gear fa-lg"></i>
                        </a>
                    </td>
                </tr>
            {/foreach}
        {/if}
        </tbody>
    </table>
</div>