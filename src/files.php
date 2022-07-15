<?
$projectName = 'site-name.ru';
$projectLogoUrl = 'images/logo-white.svg';
$projectFolderUrl = 'http://test.eremenko.com.ua/site-name/';

echo '<h1 style="border-radius:7px;background:#16406F;color:#fff;padding:10px;display:flex;align-items:center;font-size:24px;"><img style="width:150px;margin-right:15px;" src="'.$projectLogoUrl.'" alt=""/> '.$projectName.' project / files list</h1>';

$i = 1;
foreach (scandir(dirname(__FILE__)) as $file){
    if(preg_match('/\.(html)/', $file)) {
        $name = explode(".html", $file);
        $fileUrl = $projectFolderUrl.$file;
        $fileTags = get_meta_tags($fileUrl);

        echo '<div style="margin-top:7px;"><strong>'.$i.'. </strong><a href="'.$fileUrl.'" target="_blank">'.$file.'</a> - <span style="font-size:15px;color:#fff;background:#16406F;padding:1px 5px 2px 5px;border-radius:3px;">'.$fileTags['file-desc'].'</span></div>';

        $i++;
    }
}
?>
