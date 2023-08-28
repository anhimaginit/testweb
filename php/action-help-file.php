<?php
if (!session_id()) session_start();
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');

$field = ['id', 'title', 'slug', 'category', 'sub_category', 'content'];

$required_fields = ['title', 'slug', 'category', 'content'];
$isValid = checkValidate($required_fields);

// check required field
// foreach ($required_fields as $f) {
//     $isValid = checkValidate($f);
// }

//get data storage
$path = "../data/help/help-file.json";
$myjson = json_decode(file_get_contents($path));

if (!isset($myjson) || $myjson == '' || $myjson == '""') {
    $myjson = array();
}

$myjson = (array) $myjson;
//
if ($isValid == true) {
    $data = $_POST['content'];
    $name = $_POST['slug'];
    $links = $_POST['category'] . '/';
    if (isset($_POST['sub_category']) && $_POST['sub_category'] != '') {
        $links .= $_POST['sub_category'] . '/';
    }
    $name = "ajax/help/" . $links . $name;

    if (!empty($name)) {
        /**--------------- Save content-------------- */
        $count = '';
        if (file_exists($name . '.html')) {
            if (isset($_POST['id'])) {
                if (isset($myjson[$_POST['id']]) && $myjson[$_POST['id']]->slug != $name) {
                    $count = 1;
                    while (file_exists($name . $count . '.html')) {
                        $count++;
                    }
                    $name .= '-' . $count;
                    $count = '-' . $count;
                }
            } else {
                $count = 1;
                while (file_exists($name . $count . '.html')) {
                    $count++;
                }
                $name .= '-' . $count;
                $count = '-' . $count;
            }
        }
        $_POST['slug'] = $_POST['slug'] . $count;
        $name .= '.html';

        if (!is_dir("../ajax/help/" . $_POST['category'])) {
            mkdir("../ajax/help/" . $_POST['category']);
        }
        if (!is_dir('../ajax/help/' . $_POST['category'] . '/' . $_POST['sub_category'])) {
            $dir = '../ajax/help/' . $_POST['category'];
            $item = explode('/', $_POST['sub_category']);
            for ($i = 0; $i < sizeof($item); $i++) {
                $dir .= '/' . trim($item[$i]);
                if (!is_dir($dir)) {
                    mkdir($dir);
                }
            }
        }

        $upload = file_put_contents('../' . $name, $data);
        /**--------end save content--------------------- */
        if ($upload > 0) {
            /**-----  save storage help  ---------------------- */
            $myFile = fopen($path, "w");
            $oldAttr = (object) array();
            $attrID = $_POST['slug'];

            if (isset($_POST['id'])) {
                if ($_POST['id'] != $_POST['slug']) {
                    $oldAttr = $myjson[$_POST['id']];
                    unset($myjson[$_POST['id']]);
                    unlink('../' . $oldAttr->content);
                }
            }
            $newAttr = array(
                'id' => $attrID,
                'title' => $_POST['title'],
                'slug' => $_POST['slug'],
                'category' => $_POST['category'],
                'sub_category' => isset($_POST['sub_category']) ? $_POST['sub_category'] : '',
                'content' => $name,
                'created_date' => $_POST['created_date'],
                'last_update_date' => $_POST['last_update_date'],
                'last_update_by_name' => $_SESSION['user_name'],
                'last_update_by' => $_SESSION['userID']
            );

            if (!isset($_POST['id'])) {
                unset($newAttr->last_update_date);
                unset($newAttr->last_update_by_name);
                unset($newAttr->last_update_by);
            }

            $myjson[$attrID] = $newAttr;

            fwrite($myFile, json_encode($myjson));
            fclose($myFile);
            // file_put_contents($path, json_encode($myjson));
            /**------  end save storage help  ---------------------- */

            /**------  update category  --------------------------- */
            $help_category = json_decode(file_get_contents('../data/help/help-category.json'));
            if (!in_array($_POST['category'], $help_category)) {
                array_push($help_category);
                sort($help_category);
                file_put_contents('../data/help/help-category.json', json_encode($help_category));
            }
            /**------  end update category  ------------------------ */

            echo '{"error" : "", "success" : true, "id" : "' . $attrID . '"}';
        } else {
            echo '{"error" : "Error! Cannot upload the file. Please try again", "success" : false}';
        }
        return;
    } else {
        echo '{"error" : "Please choose file to upload", "success" : false}';
        return;
    }
} else {
    echo '{"error" : "' . $isValid . '", "success" : false}';
}

function checkValidate($fields)
{
    foreach ($fields as $attr) {
        if (!isset($_POST[$attr]) || $_POST[$attr] == '') {
            return 'The field ' . $attr . ' is required.';
        }
    }
    return true;
}

function updateCategory()
{
    $help_category = json_decode(file_get_contents('../data/help/help-category.json'));
    if (!in_array($_POST['category'], $help_category)) {
        array_push($help_category);
        sort($help_category);
        file_put_contents('../data/help/help-category.json', json_encode($help_category));
    }
}
