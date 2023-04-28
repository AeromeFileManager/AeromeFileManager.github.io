This is just a note to remind myself how to edit the interactive video demo in the future

- record at 820 x 620
    ```
    # Resizing windows Linux
    xdotool search --name Future
    xdotool windowsize {id} 820 620
    ```

- use ffmpeg to clip content down to 800 x 600
    ```
    ffmpeg -i input.mp4 -filter:v "crop=in_w-20:in_h-20:10:10" output.mp4
    ```

- interlace the audio track with that clip in OpenShot at 800 x 600

- use DOM as extra magic to intermix the clip with screenshots of supposidly opened files
