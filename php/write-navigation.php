<?php

class MakeNavigation
{
    public static function writeNavigation($jsonData)
    {
        $my_navigation = array();
        function filterEmpty($item)
        {
            return $item != null && $item != '' && strlen($item) > 0;
        }
        foreach ($jsonData as $key => $value) {
            $value = (object) $value;
            if (!isset($my_navigation[$value->category])) {
                $my_navigation[$value->category] = array(
                    'title' => $value->category,
                    // 'icon' => 'fa-folder-o',
                    'sub' => array()
                );
            }
            if (isset($value->sub_category) && $value->sub_category != '' && isset($value->id) && $value->id != '') {
                $split_array = explode('/', $value->sub_category);
                $array_filter = array_filter($split_array, 'filterEmpty');

                switch (sizeof($array_filter)) {
                    case 0:
                        break;
                    case 1:
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]] = array(
                                'title' => $array_filter[0],
                                // //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }
                        $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['o_' . $value->id] = array(
                            'title' => $value->title,
                            'icon' => 'fa-file-o',
                            'url' => '#' . $value->content
                        );
                        break;
                    case 2:
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]] = array(
                                'title' => $array_filter[0],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]] = array(
                                'title' => $array_filter[1],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }

                        $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['o_' . $value->id] = array(
                            'title' => $value->title,
                            'icon' => 'fa-file-o',
                            'url' => '#' . $value->content
                        );
                        break;
                    case 3:
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]] = array(
                                'title' => $array_filter[0],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]] = array(
                                'title' => $array_filter[1],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }

                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]] = array(
                                'title' => $array_filter[2],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }

                        $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]]['sub']['o_' . $value->id] = array(
                            'title' => $value->title,
                            'icon' => 'fa-file-o',
                            'url' => '#' . $value->content
                        );

                        break;
                    case 4:
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]] = array(
                                'title' => $array_filter[0],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]] = array(
                                'title' => $array_filter[1],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }

                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]] = array(
                                'title' => $array_filter[2],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]]['sub']['f_' . $array_filter[3]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]]['sub']['f_' . $array_filter[3]] = array(
                                'title' => $array_filter[3],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }

                        $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]]['sub']['f_' . $array_filter[3]]['sub']['o_' . $value->id] = array(
                            'title' => $value->title,
                            'icon' => 'fa-file-o',
                            'url' => '#' . $value->content
                        );
                        break;
                    case 5:
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]] = array(
                                'title' => $array_filter[0],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]] = array(
                                'title' => $array_filter[1],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }

                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]] = array(
                                'title' => $array_filter[2],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }
                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]]['sub']['f_' . $array_filter[3]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]]['sub']['f_' . $array_filter[3]] = array(
                                'title' => $array_filter[3],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }

                        if (!isset($my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]]['sub']['f_' . $array_filter[3]]['sub']['f_' . $array_filter[4]])) {
                            $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]]['sub']['f_' . $array_filter[3]]['sub']['f_' . $array_filter[4]] = array(
                                'title' => $array_filter[4],
                                //'icon' => 'fa-folder-o',
                                'sub' => array()
                            );
                        }

                        $my_navigation[$value->category]['sub']['f_' . $array_filter[0]]['sub']['f_' . $array_filter[1]]['sub']['f_' . $array_filter[2]]['sub']['f_' . $array_filter[3]]['sub']['f_' . $array_filter[4]]['sub']['o_' . $value->id] = array(
                            'title' => $value->title,
                            'icon' => 'fa-file-o',
                            'url' => '#' . $value->content
                        );
                        break;
                }
            } else if (isset($value->id) && $value->id != '') {
                $my_navigation[$value->category]['sub']['o_' . $value->id] = array(
                    'title' => $value->title,
                    'icon' => 'fa-file-o',
                    'url' => '#' . $value->content
                );
            }
        }
        // file_put_contents('../data/help/help-navigation.json', json_encode($my_navigation));
        return $my_navigation;
    }
}
