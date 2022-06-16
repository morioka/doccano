# auto-labeling機能のサンプル

Sequence Labeling タスクについてauto-labeling機能の小さな例を作る。

Sequence Labelingの実例としてNER。
REST APIサーバとしてspacy/GiNZAでNERを行うサーバをFastAPIで作成する。

※ 現在、Sequence Labeling には Span Label のみの対応で、Relation Labelは想定外のようだ。


## ダミー APIサーバの起動

```bash
uvicorn auto_labeling_ner:app --reload --host 0.0.0.0 --port 8000
```

## doccano project での auto-labeling 設定の作成

1. Select a Template

    | 項目 | 値 |
    | -- | -- |
    | job | Sequence Labeling |
    | config | Custom REST Request |

2. Set parameters

    | 項目 | 値 |
    | -- | -- |
    | url | http://localhost:8000/ner |
    | method | POST |

    Params:
    | Key | Value |
    | -- | -- |
    |  |  |

    Headers:
    | Key | Value |
    | -- | -- |
    | Content-Type | application/json |

    Body:
    | Key | Value |
    | -- | -- |
    | text | {{ text }} |

    
3. Set a template

    FastAPI側でdoccanoが要求する形式に合わせこんでいるので、ほぼ素通し。

    ```jinja
    [
        {% for entity in input %}
            {
                "start_offset": {{ entity.start_offset }},
                "end_offset": {{ entity.end_offset}},
                "label": "{{ entity.label }}"
            }{% if not loop.last %},{% endif %}
        {% endfor %}
    ]
    ```

4. Set mappings

    プロジェクトのラベルに合わせて対応を変える必要があるかもしれない。

    | From | To |
    | -- | -- |
    |    |    |

## 参考

- [Auto Labeling settings - doccano](https://doccano.github.io/doccano/advanced/auto_labelling_config/)
- [Auto labelling from local REST request (express.js) and having server error in the templete setting step · Issue #1835 · doccano/doccano](https://github.com/doccano/doccano/issues/1835)
- [Auto Labeling how to Write a mapping template to extract labels from API responses · Issue #1281 · doccano/doccano](https://github.com/doccano/doccano/issues/1281)
- [How to connect to a local REST API for auto annotation? · Issue #1417 · doccano/doccano](https://github.com/doccano/doccano/issues/1417)

## 不満/不明な点

- exampleを開くたびに問答無用で適用される。せっかく手作業で直しても、開きなおすと元の木阿弥。
  - チェックマークが立ったexampleは適用除外するか、「ラベル付けして！」ボタンを押せば適用してくれるようだとうれしい。
  - Finally, move to the "annotation" page and click "Auto Labeling" button. It should display a "Slide" button for switching enable/disable auto-labeling feature. Try to enable it: (略) Each time you view a new document, it will be labeled automatically.  とあるし、注意深くなるしか。 "Each time you view a new document" の new がどのような意味を持つのか
  - チェック状態でもauto-labelingが働くのは期待していない挙動では？を、[auto-labeling - when open the auto-labeling, it erased the checked result · Issue #1816 · doccano/doccano](https://github.com/doccano/doccano/issues/1816)このissueでも挙げている
  - 新しく doc.id (_id)に対してviewを作るときにデータをfetchするが、そのときにautoLabelを呼ぶ。その条件がauto-labelingがenabledかどうか。ここを直してあればよい? [maybe fix #1816 · morioka/doccano@c406942](https://github.com/morioka/doccano/commit/c406942525cdbf0b9df97961cebf5753c2629020)
- いちどauto-labeling設定を作成すると、enable/disableのほかは設定を削除することしかできない。
  - 修正はさておき、内容を確認できない
  - 設定に名前を付けられないので複数の設定を区別できない
  - 複数の設定の優先順位や個別のenable/disableもない?


以上